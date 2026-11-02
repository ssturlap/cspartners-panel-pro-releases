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
  // Dimension rows under the floor: 1+ rows of each module's width (stacked modules get their
  // own row), one row of each group of touching modules, then the overall width.
  var EPS = 1;
  function widthRows() {
    var rows = [];
    C.items.map(function (it) { return { it: it, w: world(it) }; })
      .sort(function (a, b) { return (b.w.z1 - b.w.z0) - (a.w.z1 - a.w.z0); })
      .forEach(function (o) {
        // first row where it doesn't overlap anything already there
        var r = rows.find(function (row) { return row.every(function (q) { return q.w.x1 <= o.w.x0 + EPS || q.w.x0 >= o.w.x1 - EPS; }); });
        if (!r) { r = []; rows.push(r); }
        r.push(o);
      });
    rows.forEach(function (row) { row.sort(function (a, b) { return a.w.x0 - b.w.x0; }); });
    return rows;
  }
  // Runs of modules whose sides touch or overlap (left to right).
  function groups() {
    var list = C.items.map(world).sort(function (a, b) { return a.x0 - b.x0; }), out = [];
    list.forEach(function (w) {
      var g = out[out.length - 1];
      if (g && w.x0 <= g.x1 + EPS) { g.x1 = Math.max(g.x1, w.x1); g.n += 1; } else { out.push({ x0: w.x0, x1: w.x1, n: 1 }); }
    });
    return out;
  }
  // A group row only helps when there are several groups and one of them joins modules.
  function showGroups(g) { return g.length > 1 && g.some(function (x) { return x.n > 1; }); }
  function dimRowCount() {
    var g = groups();
    return widthRows().length + (showGroups(g) ? 1 : 0) + 1;
  }

  // Fitted view: the modules plus room for the dimension rows (sized in screen pixels).
  var ROW_PX = 30;
  function viewPx() {
    var el = document.getElementById('csvg'), r = el && el.getBoundingClientRect();
    return r && r.width > 50 ? { w: r.width, h: r.height } : { w: Math.min(innerWidth, 1000), h: innerHeight * 0.6 };
  }
  function fitBox() {
    var e = extents(), w = e.x1 - e.x0, h = e.z1 - e.z0, px = viewPx();
    var m = Math.max(w, h) * 0.04 + 80, n = dimRowCount() + 0.9, vw = w + 2 * m, vh = h * 1.3, left = m, top = m;
    for (var i = 0; i < 4; i++) {                       // labels take pixels, so the scale decides their size in mm
      var k = Math.max(vw / px.w, vh / px.h);
      left = m + ROW_PX * 1.6 * k;                      // the overall height and its label, left of everything
      top = m * 0.4 + 28 * k;                           // the module code tags above the tallest one
      vw = w + left + m;
      vh = h + top + ROW_PX * k * n + 16 * k;
    }
    vb = { x: e.x0 - left, y: -(e.z1 + top), w: vw, h: vh };
    C.view = null;
  }
  function cur() { return C.view || vb; }

  function moduleSvg(it) {
    var R = window.PPReports, polys = [];
    (it.res ? it.res.parts : []).slice().sort(function (a, b) { return R.ORDER.indexOf(a.role) - R.ORDER.indexOf(b.role); }).forEach(function (p) {
      var g = R.frontPoly(p);
      if (g) { polys.push('<polygon points="' + g.map(function (q) { return q[0].toFixed(1) + ',' + (-q[1]).toFixed(1); }).join(' ') + '" fill="var(--' + p.role + ')"/>'); }
    });
    var b = it.bb, sel = C.sel === it.m.id;
    var cx = (b.x0 + b.x1) / 2, chip = Math.min(Math.max(30 * (C.k || 1), 60), Math.max((b.x1 - b.x0) * 0.8, 60));   // ~30 px wide on screen
    return '<g class="cmod' + (sel ? ' on' : '') + '" data-mid="' + A.esc(it.m.id) + '" transform="translate(' + it.m.pos.x + ' ' + (-it.m.pos.z) + ')">' +
      '<rect class="hit" x="' + b.x0 + '" y="' + (-b.z1) + '" width="' + (b.x1 - b.x0) + '" height="' + (b.z1 - b.z0) + '"/>' +
      '<g class="parts">' + polys.join('') + '</g>' +
      '<rect class="selbox" x="' + b.x0 + '" y="' + (-b.z1) + '" width="' + (b.x1 - b.x0) + '" height="' + (b.z1 - b.z0) + '"/>' +
      '<g class="chip"><rect x="' + (cx - chip / 2) + '" y="' + (-b.z1 - chip * 0.62) + '" width="' + chip + '" height="' + chip * 0.5 + '" rx="' + chip * 0.12 + '"/>' +
      '<text x="' + cx + '" y="' + (-b.z1 - chip * 0.25) + '" font-size="' + chip * 0.34 + '">' + A.esc(it.code) + '</text></g></g>';
  }

  function dimsSvg() {
    if (!C.items.length) { return ''; }
    var svg = document.getElementById('csvg'), k = svg ? svgScale(svg) : cur().w / viewPx().w;
    // label sizes in screen pixels: readable at any zoom; a label that doesn't fit its span at
    // MIN px is left out (zoom in to see it)
    var e = extents(), row = ROW_PX * k, fs = 13 * k, fs2 = 12 * k, tk = 5 * k, MIN = 10 * k;
    var out = [], placed = [];
    function line(x1, y1, x2, y2, cls) { out.push('<line' + (cls ? ' class="' + cls + '"' : '') + ' x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'); }
    function ticks(x, y) { line(x - tk, y + tk, x + tk, y - tk); }
    // a horizontal dimension from x0 to x1 at height y (svg units), label under it
    function hdim(x0, x1, y, size, cls) {
      if (x1 - x0 < 1) { return; }
      line(x0, y, x1, y, cls); ticks(x0, y); ticks(x1, y);
      var txt = A.LU(x1 - x0);
      var f = Math.min(size, (x1 - x0) / (txt.length * 0.6));   // shrink to fit narrow modules
      if (f < MIN) { return; }
      // labels that would run into a neighbour's go under the line; if that is taken too, zoom shows them
      var cx = (x0 + x1) / 2, half = txt.length * 0.3 * f + 2 * k;
      var free = function (ty) { return !placed.some(function (q) { return Math.abs(q.y - ty) < f && q.a < cx + half && q.b > cx - half; }); };
      var ty = y - f * 0.35;
      if (!free(ty)) { ty = y + f * 1.05; if (!free(ty)) { return; } }
      placed.push({ y: ty, a: cx - half, b: cx + half });
      out.push('<text class="' + (cls || '') + '" x="' + cx + '" y="' + ty + '" font-size="' + f + '">' + A.esc(txt) + '</text>');
    }
    // a vertical dimension (heights), label rotated, to the left of the line
    function vdim(x, z0, z1, size, cls) {
      if (z1 - z0 < 1) { return; }
      line(x, -z0, x, -z1, cls); ticks(x, -z0); ticks(x, -z1);
      var txt = A.LU(z1 - z0), f = Math.min(size, (z1 - z0) / (txt.length * 0.6));
      if (f < MIN) { return; }
      var cy = -(z0 + z1) / 2, cx = x - f * 0.35;
      out.push('<text class="' + (cls || '') + '" x="' + cx + '" y="' + cy + '" font-size="' + f + '" transform="rotate(-90 ' + cx + ' ' + cy + ')">' + A.esc(txt) + '</text>');
    }
    // 1. each module's width (and the gaps between), one row per level of stacking
    var y = -e.z0 + row * 0.9;
    widthRows().forEach(function (r) {
      r.forEach(function (o, i) {
        hdim(o.w.x0, o.w.x1, y, fs2);
        var next = r[i + 1];
        if (next && next.w.x0 - o.w.x1 > EPS) { hdim(o.w.x1, next.w.x0, y, fs2, 'd-gap'); }
      });
      y += row;
    });
    // 2. groups of touching modules (only when it adds something)
    var gs = groups();
    if (showGroups(gs)) {
      gs.forEach(function (g, i) {
        hdim(g.x0, g.x1, y, fs, 'd-grp');
        var next = gs[i + 1];
        if (next) { hdim(g.x1, next.x0, y, fs2, 'd-gap'); }
      });
      y += row;
    }
    // 3. overall width
    hdim(e.x0, e.x1, y, fs * 1.1, 'd-all');
    // heights: each module inside its own outline (near its left side), the whole on the far left
    C.items.forEach(function (it) {
      var w = world(it), inset = Math.min((w.x1 - w.x0) * 0.16, row);
      vdim(w.x0 + inset + fs2, w.z0, w.z1, fs2, 'd-in');   // inside the module, on a white label
      // height off the floor, when nothing stands under it
      var under = C.items.some(function (o) { if (o === it) { return false; } var v = world(o); return v.x0 < w.x1 - EPS && v.x1 > w.x0 + EPS && v.z1 <= w.z0 + EPS && v.z1 > e.z0 + EPS; });
      if (w.z0 > EPS && !under) { vdim(w.x0 + inset + fs2 * 2.6, e.z0, w.z0, fs2, 'd-gap'); }
    });
    vdim(e.x0 - row * 0.9, e.z0, e.z1, fs * 1.1, 'd-all');
    return '<g class="cdims" style="--halo:' + (3.5 * k).toFixed(2) + 'px">' + out.join('') + '</g>';
  }

  function draw2d() {
    var svg = document.getElementById('csvg');
    if (!svg) { return; }
    var v = cur();
    svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
    C.k = svgScale(svg);
    var floor = '<line class="floor" x1="' + (v.x - 2 * v.w) + '" y1="0" x2="' + (v.x + 3 * v.w) + '" y2="0"/>';
    svg.innerHTML = floor + C.items.map(moduleSvg).join('') + dimsSvg();
  }

  function svgScale(svg) { // mm per screen pixel (viewBox is fitted with "meet")
    var r = svg.getBoundingClientRect(), v = cur();
    return Math.max(v.w / (r.width || 1), v.h / (r.height || 1));
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

  // Drag a module to move it; drag the background to pan; pinch (or the mouse wheel) to zoom;
  // double-tap the background or press Fit to see everything again.
  function wire2d(svg) {
    var drag = null, pts = {}, pinch = null, pan = null, lastTap = 0;
    // the view as the screen shows it (same proportions, so screen and drawing map linearly)
    function screenView() {
      var r = svg.getBoundingClientRect(), v = cur(), k = svgScale(svg);
      var w = r.width * k, h = r.height * k;
      return { x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2, w: w, h: h };
    }
    function setView(v, redrawAll) {
      var min = 150, max = vb.w * 8;
      var f = v.w < min ? min / v.w : v.w > max ? max / v.w : 1;
      if (f !== 1) { var cx = v.x + v.w / 2, cy = v.y + v.h / 2; v = { x: cx - v.w * f / 2, y: cy - v.h * f / 2, w: v.w * f, h: v.h * f }; }
      C.view = v;
      if (redrawAll) { draw2d(); } else { svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h); }
    }
    function zoomAt(clientX, clientY, factor, v0) {
      var r = svg.getBoundingClientRect(), v = v0 || screenView();
      var fx = (clientX - r.left) / r.width, fy = (clientY - r.top) / r.height;
      var px = v.x + fx * v.w, py = v.y + fy * v.h, w = v.w * factor, h = v.h * factor;
      return { x: px - fx * w, y: py - fy * h, w: w, h: h };
    }
    function two() { var k = Object.keys(pts); return k.length >= 2 ? [pts[k[0]], pts[k[1]]] : null; }
    svg.addEventListener('pointerdown', function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
      var p2 = two();
      if (p2) {                                   // second finger: zoom, and undo a module drag
        if (drag) { drag.it.m.pos = { x: drag.x, z: drag.z }; drag.g.setAttribute('transform', 'translate(' + drag.x + ' ' + (-drag.z) + ')'); drag = null; }
        pan = null;
        var r = svg.getBoundingClientRect();
        pinch = { d: Math.hypot(p2[0].x - p2[1].x, p2[0].y - p2[1].y) || 1, v: screenView(),
                  mx: (p2[0].x + p2[1].x) / 2, my: (p2[0].y + p2[1].y) / 2, r: r };
        return;
      }
      var g = e.target.closest('[data-mid]');
      if (!g) { pan = { sx: e.clientX, sy: e.clientY, v: screenView(), moved: false }; return; }
      var it = C.items.find(function (x) { return x.m.id === g.getAttribute('data-mid'); });
      drag = { it: it, sx: e.clientX, sy: e.clientY, x: it.m.pos.x, z: it.m.pos.z, moved: false, k: svgScale(svg), g: g };
    });
    svg.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) { return; }
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (pinch) {
        var p2 = two(); if (!p2) { return; }
        var d = Math.hypot(p2[0].x - p2[1].x, p2[0].y - p2[1].y) || 1, mx = (p2[0].x + p2[1].x) / 2, my = (p2[0].y + p2[1].y) / 2;
        var v = zoomAt(pinch.mx, pinch.my, pinch.d / d, pinch.v);          // zoom about where the fingers started
        v.x -= (mx - pinch.mx) / pinch.r.width * v.w; v.y -= (my - pinch.my) / pinch.r.height * v.h;   // and follow them
        setView(v, false);
        return;
      }
      if (pan) {
        var r = svg.getBoundingClientRect(), dx = e.clientX - pan.sx, dy = e.clientY - pan.sy;
        if (!pan.moved && Math.abs(dx) + Math.abs(dy) < 6) { return; }
        pan.moved = true;
        setView({ x: pan.v.x - dx / r.width * pan.v.w, y: pan.v.y - dy / r.height * pan.v.h, w: pan.v.w, h: pan.v.h }, false);
        return;
      }
      if (!drag) { return; }
      var ddx = (e.clientX - drag.sx) * drag.k, dz = -(e.clientY - drag.sy) * drag.k;
      if (!drag.moved && Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) < 6) { return; }
      drag.moved = true;
      var sp = snap(drag.it, drag.x + ddx, drag.z + dz, SNAP_PX * drag.k);
      drag.it.m.pos = { x: Math.round(sp.x * 10) / 10, z: Math.round(sp.z * 10) / 10 };
      drag.g.setAttribute('transform', 'translate(' + drag.it.m.pos.x + ' ' + (-drag.it.m.pos.z) + ')');
    });
    function end(e) {
      delete pts[e.pointerId];
      if (pinch) { if (!two()) { pinch = null; draw2d(); } return; }   // labels redrawn at the new size
      if (pan) {
        var pn = pan; pan = null;
        if (pn.moved) { draw2d(); return; }
        var now = Date.now();
        if (now - lastTap < 350) { fitBox(); draw2d(); lastTap = 0; return; }   // double tap: see everything
        lastTap = now;
        if (C.sel) { C.sel = null; draw2d(); panel(); }
        return;
      }
      if (!drag) { return; }
      var d = drag; drag = null;
      C.sel = d.it.m.id;
      if (d.moved) { A.persist(); if (!C.view) { fitBox(); } }
      draw2d(); panel();
    }
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      setView(zoomAt(e.clientX, e.clientY, Math.pow(1.0015, e.deltaY)), false);
      clearTimeout(svg._wz); svg._wz = setTimeout(draw2d, 160);
    }, { passive: false });
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
      (it.m.params.panel ? '<div class="crow seg cturn">' + [['top', 'Flat (over a module)'], ['side', 'On edge (beside a module)'], ['filler', 'Upright (front / gap)']].map(function (o) {
        var k = it.m.params.panel_kind === 'back' ? 'filler' : it.m.params.panel_kind;
        return '<button type="button" data-turn="' + o[0] + '" aria-pressed="' + (k === o[0]) + '">' + esc(t(o[1])) + '</button>';
      }).join('') + '</div>' : '') +
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
    box.querySelectorAll('[data-turn]').forEach(function (b) {
      b.onclick = function () { turnPanel(it, b.getAttribute('data-turn')); };
    });
    document.getElementById('cEdit').onclick = function () { A.go('#/site/' + encodeURIComponent(C.s.id) + '/m/' + encodeURIComponent(it.m.id)); };
    document.getElementById('cFloor').onclick = function () { it.m.pos.z = -it.bb.z0; A.persist(); fitBox(); redraw(false); panel(); };
  }

  // Turn a loose panel: its two face sizes move to the new orientation (the length stays the
  // length), the thickness becomes the third size. The engine re-normalizes it.
  function turnPanel(it, kind) {
    var p = it.m.params, k = p.panel_kind;
    var a = k === 'top' ? [p.width, p.depth] : k === 'side' ? [p.height, p.depth] : [p.width, p.height];
    var len = Math.max(a[0], a[1]), wid = Math.min(a[0], a[1]);
    var q = Object.assign({}, p, { panel_kind: kind === 'filler' && k === 'back' ? 'back' : kind });
    if (kind === 'top') { q.width = len; q.depth = wid; }
    else if (kind === 'side') { q.height = len; q.depth = wid; }
    else { q.width = len; q.height = wid; }
    var w0 = world(it);
    it.m.params = A.normalize(q);
    it.m.updated = new Date().toISOString();
    it.res = A.buildModule(it.m); it.bb = bboxOf(it.res);
    it.m.pos = { x: w0.x0 - it.bb.x0, z: w0.z0 - it.bb.z0 };   // keep its bottom-left corner where it was
    A.persist(); fitBox(); redraw(false); panel();
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
      '<div class="view-tools"><button type="button" id="cMode" class="vt vt-txt" title="2D / 3D">3D</button>' + A.vtBtn('cOpen', 'open', t('Open all'), ' aria-pressed="false"') +
      A.vtBtn('cFit', 'fit', t('Fit')) + '</div></div>' +
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
    document.getElementById('cOpen').onclick = function () { var o = P3D.toggle('all'); A.setOpenBtn(this, o); };
    document.getElementById('cMore').onclick = function () {
      A.menu(t('Composition'), [
        { label: t('Arrange again side by side'), run: function () {
          C.items.forEach(function (it) { delete it.m.pos; }); autoPlace(C.items); A.persist(); fitBox(); redraw(true); panel();
        } }
      ]);
    };
    wire2d(document.getElementById('csvg'));
    fitBox();                                       // again, now that the drawing area has its size
    if (A.has3d()) { P3D.setDims(A.dimsShown()); }
    redraw(true);
    panel();
  }

  window.PPCompose = { render: render };
})();
