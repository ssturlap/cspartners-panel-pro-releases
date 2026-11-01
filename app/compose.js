/* PanelPro Web — Composition view (web app only; in SketchUp the model itself is the composition).
 *
 * Arrange a site's modules on one wall: drag them side by side or one over another; they snap
 * to the floor, to each other's sides and on top of each other. Positions are stored on each
 * module ({ x, z } in mm: x = left of the carcass from the composition's left, z = height of the
 * module's base above the floor) and travel with the site in the project file.
 * Every module is still built by the shared engine; this screen only places the results.
 */
(function () {
  'use strict';
  var A = null; // app helpers (window.PPApp)
  var C = null; // { s, items: [{ m, res, bb, code }], sel, mode }

  var SNAP_PX = 14;

  function bboxOf(res) {
    var b = res && res.bbox;
    if (b && b[0] && b[1]) { return { x0: b[0][0], y0: b[0][1], z0: b[0][2], x1: b[1][0], y1: b[1][1], z1: b[1][2] }; }
    return { x0: 0, y0: 0, z0: 0, x1: 600, y1: 600, z1: 720 };
  }

  // Modules without a position yet: floor-standing ones side by side, raised ones (wall
  // cabinets) side by side at their own height, both runs starting at the left.
  function autoPlace(items) {
    var xf = 0, xu = 0;
    items.forEach(function (it) {
      if (it.m.pos && isFinite(it.m.pos.x)) { return; }
      var elev = Number(it.m.params.elevation) || 0;
      var w = it.bb.x1 - it.bb.x0;
      if (elev > 0) { it.m.pos = { x: xu - it.bb.x0, z: elev }; xu += w; }
      else { it.m.pos = { x: xf - it.bb.x0, z: 0 }; xf += w; }
    });
  }

  function load() {
    var s = C.s, codes = A.codesOf(s);
    C.items = s.modules.slice().sort(A.codeSort(codes)).map(function (m) {
      var res = A.buildModule(m);
      return { m: m, res: res, bb: bboxOf(res), code: codes[m.id] || '?' };
    });
    autoPlace(C.items);
  }

  function world(it) {
    var p = it.m.pos;
    return { x0: p.x + it.bb.x0, x1: p.x + it.bb.x1, z0: p.z + it.bb.z0, z1: p.z + it.bb.z1 };
  }
  function extents() {
    var e = { x0: 0, x1: 1000, z0: 0, z1: 1000 }, first = true;
    C.items.forEach(function (it) {
      var w = world(it);
      if (first) { e = { x0: w.x0, x1: w.x1, z0: Math.min(0, w.z0), z1: w.z1 }; first = false; return; }
      e.x0 = Math.min(e.x0, w.x0); e.x1 = Math.max(e.x1, w.x1); e.z0 = Math.min(e.z0, w.z0); e.z1 = Math.max(e.z1, w.z1);
    });
    return e;
  }

  // ------------------------------------------------------------------ 2D wall
  var vb = null; // current viewBox { x, y, w, h } (y = −z)
  function fitBox() {
    var e = extents(), w = e.x1 - e.x0, h = e.z1 - e.z0;
    var m = Math.max(w, h) * 0.08 + 150;
    vb = { x: e.x0 - m, y: -(e.z1 + m * 0.6), w: w + 2 * m, h: h + m * 1.6 + 120 };
  }

  function moduleSvg(it) {
    var R = window.PPReports, polys = [];
    (it.res ? it.res.parts : []).slice().sort(function (a, b) { return R.ORDER.indexOf(a.role) - R.ORDER.indexOf(b.role); }).forEach(function (p) {
      var g = R.frontPoly(p);
      if (g) { polys.push('<polygon points="' + g.map(function (q) { return q[0].toFixed(1) + ',' + (-q[1]).toFixed(1); }).join(' ') + '" fill="var(--' + p.role + ')"/>'); }
    });
    var b = it.bb, sel = C.sel === it.m.id;
    var cx = (b.x0 + b.x1) / 2, chip = Math.max(70, Math.min(140, (b.x1 - b.x0) * 0.3));
    return '<g class="cmod' + (sel ? ' on' : '') + '" data-mid="' + A.esc(it.m.id) + '" transform="translate(' + it.m.pos.x + ' ' + (-it.m.pos.z) + ')">' +
      '<rect class="hit" x="' + b.x0 + '" y="' + (-b.z1) + '" width="' + (b.x1 - b.x0) + '" height="' + (b.z1 - b.z0) + '"/>' +
      '<g class="parts">' + polys.join('') + '</g>' +
      '<rect class="selbox" x="' + b.x0 + '" y="' + (-b.z1) + '" width="' + (b.x1 - b.x0) + '" height="' + (b.z1 - b.z0) + '"/>' +
      '<g class="chip"><rect x="' + (cx - chip / 2) + '" y="' + (-b.z1 - chip * 0.62) + '" width="' + chip + '" height="' + chip * 0.5 + '" rx="' + chip * 0.12 + '"/>' +
      '<text x="' + cx + '" y="' + (-b.z1 - chip * 0.25) + '" font-size="' + chip * 0.34 + '">' + A.esc(it.code) + '</text></g></g>';
  }

  function dimsSvg() {
    if (!C.items.length) { return ''; }
    var e = extents(), off = vb.w * 0.035, fs = vb.w * 0.026, tk = vb.w * 0.008;
    var y = -e.z0 + off * 1.6, x = e.x0 - off * 1.4;
    var line = function (x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; };
    return '<g class="cdims" stroke-width="' + vb.w * 0.0015 + '">' +
      line(e.x0, y, e.x1, y) + line(e.x0, y - tk, e.x0, y + tk) + line(e.x1, y - tk, e.x1, y + tk) +
      '<text x="' + (e.x0 + e.x1) / 2 + '" y="' + (y + fs * 1.25) + '" font-size="' + fs + '">' + A.LU(e.x1 - e.x0) + '</text>' +
      line(x, -e.z0, x, -e.z1) + line(x - tk, -e.z0, x + tk, -e.z0) + line(x - tk, -e.z1, x + tk, -e.z1) +
      '<text x="' + (x - fs * 0.5) + '" y="' + (-(e.z0 + e.z1) / 2) + '" font-size="' + fs + '" transform="rotate(-90 ' + (x - fs * 0.5) + ' ' + (-(e.z0 + e.z1) / 2) + ')">' + A.LU(e.z1 - e.z0) + '</text></g>';
  }

  function draw2d() {
    var svg = document.getElementById('csvg');
    if (!svg) { return; }
    svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
    var floor = '<line class="floor" x1="' + (vb.x - vb.w) + '" y1="0" x2="' + (vb.x + 2 * vb.w) + '" y2="0" stroke-width="' + vb.w * 0.002 + '"/>';
    svg.innerHTML = floor + C.items.map(moduleSvg).join('') + dimsSvg();
  }

  function svgScale(svg) { // mm per screen pixel (viewBox is fitted with "meet")
    var r = svg.getBoundingClientRect();
    return Math.max(vb.w / r.width, vb.h / r.height);
  }

  function snap(it, x, z, tol) {
    var b = it.bb, bestX = null, bestZ = null, dx = tol, dz = tol;
    function tryX(v) { var d = Math.abs(v - x); if (d < dx) { dx = d; bestX = v; } }
    function tryZ(v) { var d = Math.abs(v - z); if (d < dz) { dz = d; bestZ = v; } }
    tryX(-b.x0); tryZ(-b.z0);                       // composition's left edge, floor
    C.items.forEach(function (o) {
      if (o === it) { return; }
      var w = world(o);
      tryX(w.x1 - b.x0); tryX(w.x0 - b.x1);         // beside it, right or left
      tryX(w.x0 - b.x0); tryX(w.x1 - b.x1);         // flush with its left / right side
      tryZ(w.z1 - b.z0); tryZ(w.z0 - b.z0);         // on top of it, or level with its base
      tryZ(w.z1 - b.z1);                            // tops level
    });
    return { x: bestX === null ? x : bestX, z: bestZ === null ? z : bestZ };
  }

  function wire2d(svg) {
    var drag = null;
    svg.addEventListener('pointerdown', function (e) {
      var g = e.target.closest('[data-mid]');
      if (!g) { if (C.sel) { C.sel = null; draw2d(); panel(); } return; }
      var it = C.items.find(function (x) { return x.m.id === g.getAttribute('data-mid'); });
      drag = { it: it, sx: e.clientX, sy: e.clientY, x: it.m.pos.x, z: it.m.pos.z, moved: false, k: svgScale(svg), g: g };
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) { return; }
      var dx = (e.clientX - drag.sx) * drag.k, dz = -(e.clientY - drag.sy) * drag.k;
      if (!drag.moved && Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) < 6) { return; }
      drag.moved = true;
      var p = snap(drag.it, drag.x + dx, drag.z + dz, SNAP_PX * drag.k);
      drag.it.m.pos = { x: Math.round(p.x * 10) / 10, z: Math.round(p.z * 10) / 10 };
      drag.g.setAttribute('transform', 'translate(' + drag.it.m.pos.x + ' ' + (-drag.it.m.pos.z) + ')');
    });
    function end() {
      if (!drag) { return; }
      var d = drag; drag = null;
      C.sel = d.it.m.id;
      if (d.moved) { A.persist(); fitBox(); }
      draw2d(); panel();
    }
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
  }

  // ------------------------------------------------------------------ 3D
  function shifted(it) {
    var p = it.m.pos, pre = it.m.id + ':', dy = C.depth - (Number(it.m.params.depth) || 0); // backs against the wall
    var d = { x: p.x, y: dy, z: p.z };
    var parts = (it.res ? it.res.parts : []).map(function (q) {
      var c = Object.assign({}, q);
      if (q.shape === 'cyl') { c.center = [q.center[0] + d.x, q.center[1] + d.y, q.center[2] + d.z]; }
      else {
        var uv = { x: ['y', 'z'], y: ['x', 'z'], z: ['x', 'y'] }[q.axis];
        c.pos = q.pos + d[q.axis];
        c.pts = q.pts.map(function (r) { return [r[0] + d[uv[0]], r[1] + d[uv[1]]]; });
      }
      if (q.mover) { c.mover = pre + q.mover; }
      return c;
    });
    var movers = (it.res ? it.res.movers : []).map(function (m) {
      var c = Object.assign({}, m, { id: pre + m.id });
      if (m.pivot) { c.pivot = [m.pivot[0] + d.x, m.pivot[1] + d.y, m.pivot[2] + d.z]; }
      return c;
    });
    return { parts: parts, movers: movers };
  }
  function draw3d(reset) {
    if (!A.has3d()) { return; }
    var parts = [], movers = [];
    C.depth = C.items.reduce(function (a, it) { return Math.max(a, Number(it.m.params.depth) || 0); }, 0);
    C.items.forEach(function (it) { var s = shifted(it); parts = parts.concat(s.parts); movers = movers.concat(s.movers); });
    P3D.update(parts, A.matInfo, movers);
    if (reset) { P3D.reset('iso'); }
  }

  // ------------------------------------------------------------------ screen
  function panel() {
    var box = document.getElementById('cpanel');
    if (!box) { return; }
    var t = A.t, esc = A.esc;
    var it = C.items.find(function (x) { return x.m.id === C.sel; });
    if (!it) {
      box.innerHTML = '<p class="meta-line">' + esc(t(C.items.length ? 'Drag modules to arrange them: they snap to the floor, side by side and on top of each other. Tap one to type its position.' : 'Add modules to the site first.')) + '</p>';
      return;
    }
    var w = world(it);
    box.innerHTML = '<div class="crow"><span class="code">' + esc(it.code) + '</span><b class="grow">' + esc(it.m.params.name || '') + '</b>' +
      '<span class="muted">' + esc(A.dimsOf(it.m.params)) + '</span></div>' +
      '<div class="crow"><span class="flbl">' + esc(t('From the left')) + '</span><button type="button" class="valbtn" data-cpos="x">' + esc(A.LU(w.x0)) + '</button></div>' +
      '<div class="crow"><span class="flbl">' + esc(t('Off the floor')) + '</span><button type="button" class="valbtn" data-cpos="z">' + esc(A.LU(w.z0)) + '</button></div>' +
      '<div class="crow"><button type="button" class="btn small" id="cEdit" style="flex:1">' + esc(t('Edit module')) + '</button>' +
      '<button type="button" class="btn small" id="cFloor" style="flex:1">' + esc(t('Put on the floor')) + '</button></div>';
    box.querySelectorAll('[data-cpos]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-cpos');
        A.openPad({ label: t(k === 'x' ? 'From the left' : 'Off the floor'), value: k === 'x' ? w.x0 : w.z0, allowZero: true, done: function (v) {
          if (k === 'x') { it.m.pos.x = v - it.bb.x0; } else { it.m.pos.z = v - it.bb.z0; }
          A.persist(); fitBox(); redraw(false); panel();
        } });
      };
    });
    document.getElementById('cEdit').onclick = function () { A.go('#/site/' + encodeURIComponent(C.s.id) + '/m/' + encodeURIComponent(it.m.id)); };
    document.getElementById('cFloor').onclick = function () { it.m.pos.z = -it.bb.z0; A.persist(); fitBox(); redraw(false); panel(); };
  }

  function redraw(reset) {
    var host = document.getElementById('cview');
    if (!host) { return; }
    host.classList.toggle('is2d', C.mode === '2d');
    document.getElementById('cMode').textContent = C.mode === '2d' ? '3D' : '2D';
    document.getElementById('cOpen').hidden = C.mode !== '3d';
    if (C.mode === '2d') { draw2d(); } else { P3D.resize(); draw3d(reset); }
  }

  function render(s) {
    A = window.PPApp;
    var t = A.t, esc = A.esc;
    C = { s: s, items: [], sel: C && C.s === s ? C.sel : null, mode: A.has3d() ? A.loadPref('panelpro.web.cmode', '2d') : '2d' };
    load();
    fitBox();
    A.show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(t('Composition')) + '<span class="sub">' + esc(s.name) + '</span></h1>' +
      '<button type="button" class="icon-btn" id="cMore" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="compose"><div class="cview view3d" id="cview"><svg id="csvg" class="csvg" preserveAspectRatio="xMidYMid meet"></svg>' +
      '<div class="view-tools"><button type="button" id="cMode">3D</button><button type="button" id="cOpen">' + esc(t('Open all')) + '</button>' +
      '<button type="button" id="cFit">' + esc(t('Fit')) + '</button></div></div>' +
      '<div class="cpanel" id="cpanel"></div></div>'
    );
    var host = document.getElementById('cview');
    host.insertBefore(A.viewer(), host.firstChild);
    document.getElementById('back').onclick = function () { history.back(); };
    document.getElementById('cMode').onclick = function () {
      if (!A.has3d()) { return; }
      C.mode = C.mode === '2d' ? '3d' : '2d'; A.savePref('panelpro.web.cmode', C.mode); redraw(true);
    };
    document.getElementById('cFit').onclick = function () { if (C.mode === '2d') { fitBox(); draw2d(); } else { P3D.zoomExtents(); } };
    document.getElementById('cOpen').onclick = function () { var o = P3D.toggle('all'); this.textContent = t(o ? 'Close all' : 'Open all'); };
    document.getElementById('cMore').onclick = function () {
      A.menu(t('Composition'), [
        { label: t('Arrange again side by side'), run: function () {
          C.items.forEach(function (it) { delete it.m.pos; }); autoPlace(C.items); A.persist(); fitBox(); redraw(true); panel();
        } }
      ]);
    };
    wire2d(document.getElementById('csvg'));
    if (A.has3d()) { P3D.setDims(A.dimsShown()); }
    redraw(true);
    panel();
  }

  window.PPCompose = { render: render };
})();
