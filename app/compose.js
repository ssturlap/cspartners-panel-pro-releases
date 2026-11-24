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
    load0();
    if (!C.refreshing && refreshComps()) {        // modules of a composition changed: its pieces are made again
      C.refreshing = true; A.persist(); load0(); C.refreshing = false;
    }
  }
  function load0() {
    var s = C.s, codes = A.codesOf(s);
    C.all = s.modules.slice().sort(A.codeSort(codes)).map(function (m) {
      var res = A.buildModule(m);
      return { m: m, res: res, bb: bboxOf(res), code: codes[m.id] || '?' };
    });
    C.room = null;
    if (C.all.some(function (it) { return it.m.room; })) { loadRoom(); return; }
    C.items = C.all;
    autoPlace(C.items);
    C.D = depthOf();
  }

  // ------------------------------------------------------------------ the room (from SketchUp)
  // Modules that carry a place in the room (m.room: x, y, z, rot) are sorted into walls by the
  // shared engine (core/room.rb). Each wall is a tab with the usual elevation (drag along the
  // wall); "Whole room" shows everything in 3D or as a plan from above.
  function roomCall() {
    var mods = C.all.filter(function (it) { return it.m.room; }).map(function (it) {
      return { id: it.m.id, code: it.code, room: it.m.room, bbox: it.res && it.res.bbox };
    });
    return Engine.call('room', { mods: mods, lang: A.lang() });
  }
  function wallBack(w) {
    return w.mods.reduce(function (a, wm) {
      var it = C.all.find(function (x) { return x.m.id === wm.id; });
      return Math.max(a, wm.perp + (it ? it.bb.y1 : 0));
    }, -1e9);
  }
  function loadRoom() {
    var L;
    try { L = roomCall(); } catch (e) { A.toast(e.message); C.items = C.all; autoPlace(C.items); return; }
    // modules added in the web app have no place yet: at the end of the first wall
    var loose = C.all.filter(function (it) { return !it.m.room; });
    if (loose.length && L.walls.length) {
      var w = L.walls[0], back = wallBack(w), end = w.length;
      loose.forEach(function (it) {
        var along = end - it.bb.x0, perp = back - it.bb.y1;
        it.m.room = { x: w.origin[0] + w.u[0] * along + w.n[0] * perp, y: w.origin[1] + w.u[1] * along + w.n[1] * perp,
                      z: Number(it.m.params.elevation) || 0, rot: w.rot };
        end += it.bb.x1 - it.bb.x0;
      });
      A.persist();
      try { L = roomCall(); } catch (e2) { A.toast(e2.message); }
    }
    C.room = L;
    if (C.tab !== 'all' && !(typeof C.tab === 'number' && C.tab >= 0 && C.tab < L.walls.length)) { C.tab = L.walls.length > 1 ? 'all' : 0; }
    pickTab();
  }
  function pickTab() {
    if (C.tab === 'all') { C.items = C.all; C.wall = null; C.D = depthOf(); return; }
    var w = C.wall = C.room.walls[C.tab];
    C.wallBack = wallBack(w);
    C.items = w.mods.map(function (wm) {
      var it = C.all.find(function (x) { return x.m.id === wm.id; });
      if (!it) { return null; }
      it.perp = wm.perp;
      it.m.pos = { x: wm.along, z: wm.z };
      return it;
    }).filter(Boolean);
    C.D = depthOf();
  }
  // a module moved along its wall: back to its place in the room
  function syncRoom() {
    if (!C.room || !C.wall) { return; }
    var w = C.wall;
    C.items.forEach(function (it) {
      var a = it.m.pos.x, r = it.m.room || {};
      it.m.room = { x: Math.round((w.origin[0] + w.u[0] * a + w.n[0] * it.perp) * 10) / 10,
                    y: Math.round((w.origin[1] + w.u[1] * a + w.n[1] * it.perp) * 10) / 10,
                    z: it.m.pos.z, rot: r.rot != null ? r.rot : w.rot };
    });
  }
  function save() { syncRoom(); A.persist(); histPush(); shareKick(); }
  // ------------------------------------------------------------------ shared 3D view of this composition
  function shareTarget() { return 'c:' + (C.room ? String(C.tab) : 'main'); }
  function shareTitle() { return A.t('Composition') + (C.room && C.wall ? ' — ' + (C.wall.name || '') : '') + ' · ' + C.s.name; }
  function shareData() {
    var parts = [], movers = [], places = null;
    if (isAll()) {
      places = {};
      C.all.forEach(function (it) {
        var r = it.m.room, pre = it.m.id + ':';
        if (!r || !it.res) { return; }
        places[it.m.id] = { x: r.x, y: r.y, z: r.z, rz: r.rot };
        it.res.parts.forEach(function (q) { var c = Object.assign({}, q, { grp: it.m.id }); if (q.mover) { c.mover = pre + q.mover; } parts.push(c); });
        (it.res.movers || []).forEach(function (m) { movers.push(Object.assign({}, m, { id: pre + m.id, grp: it.m.id })); });
      });
    } else {
      var pp = placedParts();
      parts = pp.parts; movers = pp.movers; places = pp.places;
    }
    var e = planExtents();
    return { parts: parts, movers: movers, places: places, dims: isAll() ? null : { w: e.x1 - e.x0, h: e.z1 - e.z0, d: e.y1 - e.y0 } };
  }
  // a link to this composition is brought up to date after a change (and when the screen opens:
  // its modules may have been edited since)
  function shareKick() { if (A.shareRefresh) { A.shareRefresh(C.s, shareTarget(), shareTitle(), shareData()); } }
  // ------------------------------------------------------------------ undo / redo
  // Every change of the composition (moves, pieces, compositions) is kept: Ctrl+Z / Ctrl+Shift+Z
  // (Ctrl+Y) or the ↶ ↷ buttons step back and forth.
  function histSnap() { return JSON.stringify({ modules: C.s.modules, comps: C.s.comps || [] }); }
  function histPush() {
    if (!C || !C.hist) { return; }
    var j = histSnap();
    if (j === C.hist[C.hi]) { return; }
    C.hist = C.hist.slice(0, C.hi + 1);
    C.hist.push(j);
    if (C.hist.length > 100) { C.hist.shift(); }
    C.hi = C.hist.length - 1;
    undoState();
  }
  function undo(d) {
    if (!C || !C.hist) { return; }
    var i = C.hi + d;
    if (i < 0 || i >= C.hist.length) { return; }
    C.hi = i;
    var o = JSON.parse(C.hist[i]);
    C.s.modules = o.modules; C.s.comps = o.comps;
    C.s.updated = new Date().toISOString();
    A.persist();
    C.sel = null; C.pick = null;
    C.refreshing = true; load(); C.refreshing = false;
    redraw(false); panel(); undoState();
    A.toast(A.t(d < 0 ? 'Undone' : 'Redone'));
  }
  function undoState() {
    var u = document.getElementById('cUndo'), r = document.getElementById('cRedo');
    if (u) { u.disabled = !C || !C.hist || C.hi <= 0; }
    if (r) { r.disabled = !C || !C.hist || C.hi >= C.hist.length - 1; }
  }
  function isAll() { return C.room && C.tab === 'all'; }
  // how far each module stands from the wall (run panels, 3D)

  // ------------------------------------------------------------------ where each module stands
  // Plan frame (as in 3D): x along the wall (left → right), y towards the wall (the wall is the
  // plane y = D, D = the deepest module), z up. A module is turned r° (0 / 90 / 180 / 270, seen
  // from above, like SketchUp) about its own origin and moved to T(it).
  // Stored on the module (only when used): pos.x, pos.z, pos.w = its origin's y less D (so it keeps
  // its distance from the wall when D changes), pos.r = the turn. Without pos.w its back is against
  // the wall. In a SketchUp room each wall tab keeps it.perp (distance across the wall) instead.
  function rotOf(it) { return C.room ? 0 : ((Number(it.m.pos && it.m.pos.r) || 0) % 360 + 360) % 360; }
  function rot2(r, x, y) {
    if (r === 90) { return [-y, x]; }
    if (r === 180) { return [-x, -y]; }
    if (r === 270) { return [y, -x]; }
    return [x, y];
  }
  // the module's box in its own axes; the back is its depth (not a part sticking out behind)
  function refBox(it, full) {
    var b = it.bb, d = Number(it.m.params.depth);
    return { x0: b.x0, x1: b.x1, y0: b.y0, y1: !full && d > 0 ? d : b.y1, z0: b.z0, z1: b.z1 };
  }
  // the box turned (offsets from T)
  function turnedBox(it, full) {
    var b = refBox(it, full), r = rotOf(it), o = { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9, z0: b.z0, z1: b.z1 };
    [[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].forEach(function (c) {
      var q = rot2(r, c[0], c[1]);
      o.x0 = Math.min(o.x0, q[0]); o.x1 = Math.max(o.x1, q[0]); o.y0 = Math.min(o.y0, q[1]); o.y1 = Math.max(o.y1, q[1]);
    });
    return o;
  }
  function T(it) {
    var p = it.m.pos || {}, D = C.D || 0, y;
    if (C.room && it.perp != null) { y = it.perp - C.wallBack + D; }
    else if (p.w != null && isFinite(p.w)) { y = D + Number(p.w); }
    else if (p.wy != null && isFinite(p.wy) && !rotOf(it)) { y = D - p.wy; }   // a run panel: its front's distance from the wall
    else { y = D - turnedBox(it).y1; }                                        // back against the wall
    return { x: Number(p.x) || 0, y: y, z: Number(p.z) || 0 };
  }
  function setY(it, y) {
    if (C.room && it.perp != null) { it.perp = Math.round((y + C.wallBack - C.D) * 10) / 10; return; }
    it.m.pos.w = Math.round((y - C.D) * 10) / 10;
    delete it.m.pos.wy;
  }
  // the module's box in the plan frame (ref: back = its depth, for snapping and the panel's numbers)
  function wbox(it, full, t) {
    var o = turnedBox(it, full);
    t = t || T(it);
    return { x0: t.x + o.x0, x1: t.x + o.x1, y0: t.y + o.y0, y1: t.y + o.y1, z0: t.z + o.z0, z1: t.z + o.z1 };
  }
  // 2D views: screen right (h), screen up (v) and the viewing depth (d, bigger = farther) as
  // [axis, sign] of the plan frame
  var VIEWS = {
    front: { h: ['x', 1], v: ['z', 1], d: ['y', 1] },
    back: { h: ['x', -1], v: ['z', 1], d: ['y', -1] },
    left: { h: ['y', -1], v: ['z', 1], d: ['x', 1] },
    right: { h: ['y', 1], v: ['z', 1], d: ['x', -1] },
    top: { h: ['x', 1], v: ['y', 1], d: ['z', -1] }
  };
  function V() { return VIEWS[C.side] || VIEWS.front; }
  function proj(P) { var v = V(); return [v.h[1] * P[v.h[0]], v.v[1] * P[v.v[0]], v.d[1] * P[v.d[0]]]; }
  // a module as the view shows it: { x0, x1 (screen right), z0, z1 (screen up) }
  function world(it) {
    var b = wbox(it, true), v = V();
    function rng(a) { var lo = a[1] * b[a[0] + '0'], hi = a[1] * b[a[0] + '1']; return [Math.min(lo, hi), Math.max(lo, hi)]; }
    var h = rng(v.h), u = rng(v.v);
    return { x0: h[0], x1: h[1], z0: u[0], z1: u[1] };
  }
  // where the wall is in this view (null: the view is along it)
  function wallLine() {
    var v = V(), D = C.D || 0;
    if (v.h[0] === 'y') { return { h: v.h[1] * D }; }
    if (v.v[0] === 'y') { return { v: v.v[1] * D }; }
    return null;
  }
  function onFloor() { return V().v[0] === 'z'; }
  function extents() {
    var e = { x0: 0, x1: 1000, z0: 0, z1: 1000 }, first = true;
    C.items.forEach(function (it) {
      var w = world(it);
      if (first) { e = { x0: w.x0, x1: w.x1, z0: onFloor() ? Math.min(0, w.z0) : w.z0, z1: w.z1 }; first = false; return; }
      e.x0 = Math.min(e.x0, w.x0); e.x1 = Math.max(e.x1, w.x1); e.z0 = Math.min(e.z0, w.z0); e.z1 = Math.max(e.z1, w.z1);
    });
    var wl = wallLine();
    if (wl && !first) {
      if (wl.h != null) { e.x0 = Math.min(e.x0, wl.h); e.x1 = Math.max(e.x1, wl.h); }
      if (wl.v != null) { e.z0 = Math.min(e.z0, wl.v); e.z1 = Math.max(e.z1, wl.v); }
    }
    return e;
  }
  // the whole composition in the plan frame (sizes for renders and shared links)
  function planExtents() {
    var e = null;
    C.items.forEach(function (it) {
      var b = wbox(it, true);
      if (!e) { e = b; return; }
      ['x', 'y', 'z'].forEach(function (a) { e[a + '0'] = Math.min(e[a + '0'], b[a + '0']); e[a + '1'] = Math.max(e[a + '1'], b[a + '1']); });
    });
    return e || { x0: 0, x1: 1000, y0: 0, y1: 600, z0: 0, z1: 1000 };
  }
  // every module drawn in its own axes, turned and moved to its place (3D, shared links)
  function placedParts() {
    var parts = [], movers = [], places = {};
    C.items.forEach(function (it) {
      if (!it.res) { return; }
      var t = T(it), pre = it.m.id + ':';
      places[it.m.id] = { x: t.x, y: t.y, z: t.z, rz: rotOf(it) };
      it.res.parts.forEach(function (q) { var c = Object.assign({}, q, { grp: it.m.id }); if (q.mover) { c.mover = pre + q.mover; } parts.push(c); });
      (it.res.movers || []).forEach(function (m) { movers.push(Object.assign({}, m, { id: pre + m.id, grp: it.m.id })); });
    });
    return { parts: parts, movers: movers, places: places };
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
        // the same span is already measured (stacked or lined-up modules): once is enough
        if (rows.some(function (row) { return row.some(function (q) { return Math.abs(q.w.x0 - o.w.x0) < EPS && Math.abs(q.w.x1 - o.w.x1) < EPS; }); })) { return; }
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
  function planParts() {
    var svg = window.PPRoom.planSvg(C.room, { t: A.t, show: function (v) { return A.L(v); } });
    var m = /viewBox="([^"]+)"/.exec(svg), v = m ? m[1].split(' ').map(Number) : [0, 0, 1000, 1000];
    return { vb: { x: v[0], y: v[1], w: v[2], h: v[3] }, inner: svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') };
  }
  function fitBox() {
    if (isAll()) { vb = planParts().vb; C.view = null; return; }
    var e = extents(), w = e.x1 - e.x0, h = e.z1 - e.z0, px = viewPx();
    var m = Math.max(w, h) * 0.04 + 80, n = dimRowCount() + 0.9, vw = w + 2 * m, vh = h * 1.3, left = m, top = m;
    for (var i = 0; i < 4; i++) {                       // labels take pixels, so the scale decides their size in mm
      var k = Math.max(vw / px.w, vh / px.h);
      left = m + ROW_PX * 1.6 * k;                      // the overall height and its label, left of everything
      top = m * 0.4 + (C.room ? 72 : 28) * k;            // the module code tags above the tallest one (and the wall tabs)
      vw = w + left + m;
      vh = h + top + ROW_PX * k * n + 60 * k;            // and the view picker under the drawing
    }
    vb = { x: e.x0 - left, y: -(e.z1 + top), w: vw, h: vh };
    C.view = null;
  }
  function cur() { return C.view || vb; }

  // A module's parts as this view sees them: a part facing the view is its outline, any other
  // part the rectangle it covers; far parts first so near ones cover them.
  var CYL_AX = { x: 0, y: 1, z: 2 };
  function partShapes(it) {
    var R = window.PPReports, t = T(it), r = rotOf(it), v = V(), out = [];
    function toWorld(P) { var q = rot2(r, P.x, P.y); return proj({ x: q[0] + t.x, y: q[1] + t.y, z: P.z + t.z }); }
    (it.res ? it.res.parts : []).forEach(function (p) {
      if (p.deco) { return; }
      var pts = [], face = 0, ax;
      if (p.shape === 'cyl') {
        var a = CYL_AX[p.axis], mn = [], mx = [];
        for (var i = 0; i < 3; i++) { mn[i] = p.center[i] - (i === a ? 0 : p.r); mx[i] = p.center[i] + (i === a ? p.len : p.r); }
        [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { [0, 1].forEach(function (k) {
          pts.push(toWorld({ x: i ? mx[0] : mn[0], y: j ? mx[1] : mn[1], z: k ? mx[2] : mn[2] }));
        }); }); });
      } else {
        var uv = { x: ['y', 'z'], y: ['x', 'z'], z: ['x', 'y'] }[p.axis];
        [p.pos, p.pos + p.thk].forEach(function (w) {
          p.pts.forEach(function (q) { var P = {}; P[p.axis] = w; P[uv[0]] = q[0]; P[uv[1]] = q[1]; pts.push(toWorld(P)); });
        });
        face = p.pts.length;
        ax = p.axis === 'z' ? 'z' : (r === 90 || r === 270) ? (p.axis === 'x' ? 'y' : 'x') : p.axis;
      }
      var hs = pts.map(function (q) { return q[0]; }), vs = pts.map(function (q) { return q[1]; }), ds = pts.map(function (q) { return q[2]; });
      var h0 = Math.min.apply(null, hs), h1 = Math.max.apply(null, hs), v0 = Math.min.apply(null, vs), v1 = Math.max.apply(null, vs);
      var shape = face && ax === v.d[0] ? pts.slice(0, face).map(function (q) { return [q[0], q[1]]; })
                                         : [[h0, v0], [h1, v0], [h1, v1], [h0, v1]];
      if (h1 - h0 < 0.01 && v1 - v0 < 0.01) { return; }
      out.push({ pts: shape, d: (Math.min.apply(null, ds) + Math.max.apply(null, ds)) / 2, role: p.role, o: R.ORDER.indexOf(p.role) });
    });
    return out.sort(function (a, b) { return b.d - a.d || a.o - b.o; });
  }
  function moduleSvg(it) {
    var polys = partShapes(it).map(function (q) {
      return '<polygon points="' + q.pts.map(function (c) { return c[0].toFixed(1) + ',' + (-c[1]).toFixed(1); }).join(' ') + '" fill="var(--' + q.role + ')"/>';
    });
    var b = world(it), sel = C.sel === it.m.id, picked = C.pick && C.pick.indexOf(it.m.id) >= 0;
    var cx = (b.x0 + b.x1) / 2, chip = Math.min(Math.max(30 * (C.k || 1), 60), Math.max((b.x1 - b.x0) * 0.8, 60));   // ~30 px wide on screen
    return '<g class="cmod' + (sel && !C.pick ? ' on' : '') + (picked ? ' picked' : '') + '" data-mid="' + A.esc(it.m.id) + '">' +
      '<rect class="hit" x="' + b.x0 + '" y="' + (-b.z1) + '" width="' + (b.x1 - b.x0) + '" height="' + (b.z1 - b.z0) + '"/>' +
      '<g class="parts">' + polys.join('') + '</g>' +
      '<rect class="selbox" x="' + b.x0 + '" y="' + (-b.z1) + '" width="' + (b.x1 - b.x0) + '" height="' + (b.z1 - b.z0) + '"/>' +
      '<g class="chip"><rect x="' + (cx - chip / 2) + '" y="' + (-b.z1 - chip * 0.62) + '" width="' + chip + '" height="' + chip * 0.5 + '" rx="' + chip * 0.12 + '"/>' +
      '<text x="' + cx + '" y="' + (-b.z1 - chip * 0.25) + '" font-size="' + chip * 0.34 + '">' + A.esc(it.code) + '</text></g></g>';
  }
  // far modules first (in the top view: the lowest)
  function drawOrder() {
    var v = V();
    return C.items.slice().sort(function (a, b) {
      var A1 = wbox(a, true), B1 = wbox(b, true), k = v.d[0];
      return v.d[1] * ((B1[k + '0'] + B1[k + '1']) - (A1[k + '0'] + A1[k + '1']));
    });
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
      var txt = A.L(x1 - x0);
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
      var txt = A.L(z1 - z0), f = Math.min(size, (z1 - z0) / (txt.length * 0.6));
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
      // height off the floor, when nothing stands under it (top view: how far it stands from the wall)
      if (!onFloor()) {
        var wl = wallLine();
        if (wl && wl.v != null && wl.v - w.z1 > EPS) { vdim(w.x0 + inset + fs2 * 2.6, w.z1, wl.v, fs2, 'd-gap'); }
        return;
      }
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
    if (isAll()) { svg.innerHTML = planParts().inner; return; }
    var lines = onFloor() ? '<line class="floor" x1="' + (v.x - 2 * v.w) + '" y1="0" x2="' + (v.x + 3 * v.w) + '" y2="0"/>' : '';
    var wl = wallLine();
    if (wl && wl.h != null) { lines += '<line class="floor wall" x1="' + wl.h + '" y1="' + (v.y - 2 * v.h) + '" x2="' + wl.h + '" y2="' + (v.y + 3 * v.h) + '"/>'; }
    if (wl && wl.v != null) { lines += '<line class="floor wall" x1="' + (v.x - 2 * v.w) + '" y1="' + (-wl.v) + '" x2="' + (v.x + 3 * v.w) + '" y2="' + (-wl.v) + '"/>'; }
    svg.innerHTML = lines + drawOrder().map(moduleSvg).join('') + dimsSvg();
  }

  function svgScale(svg) { // mm per screen pixel (viewBox is fitted with "meet")
    var r = svg.getBoundingClientRect(), v = cur();
    return Math.max(v.w / (r.width || 1), v.h / (r.height || 1));
  }

  // Snap the module's place t on the axes being moved: to the floor, the wall, the composition's
  // left end, and beside / flush with / on top of / in front of the other modules.
  function snap(it, t, axes, tol) {
    var o = turnedBox(it), best = {}, dist = {};
    axes.forEach(function (a) { dist[a] = tol; });
    function tr(a, v) { if (dist[a] == null) { return; } var d = Math.abs(v - t[a]); if (d < dist[a]) { dist[a] = d; best[a] = v; } }
    tr('x', -o.x0); tr('z', -o.z0); tr('y', C.D - o.y1);
    C.items.forEach(function (q) {
      if (q === it) { return; }
      var w = wbox(q);
      ['x', 'y', 'z'].forEach(function (a) {
        tr(a, w[a + '0'] - o[a + '0']); tr(a, w[a + '1'] - o[a + '1']);   // flush
        tr(a, w[a + '1'] - o[a + '0']); tr(a, w[a + '0'] - o[a + '1']);   // beside / on top / in front, behind
      });
    });
    var out = { x: t.x, y: t.y, z: t.z };
    axes.forEach(function (a) { if (best[a] != null) { out[a] = best[a]; } });
    return out;
  }
  function applyT(it, t, t0) {
    it.m.pos.x = Math.round(t.x * 10) / 10;
    it.m.pos.z = Math.round(t.z * 10) / 10;
    if (Math.abs(t.y - t0.y) > 0.05) { setY(it, t.y); }
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
        if (drag) { drag.it.m.pos = drag.pos0; drag.it.perp = drag.perp0; drag.g.removeAttribute('transform'); drag = null; }
        pan = null;
        var r = svg.getBoundingClientRect();
        pinch = { d: Math.hypot(p2[0].x - p2[1].x, p2[0].y - p2[1].y) || 1, v: screenView(),
                  mx: (p2[0].x + p2[1].x) / 2, my: (p2[0].y + p2[1].y) / 2, r: r };
        return;
      }
      var g = e.target.closest('[data-mid]');
      if (!g) { pan = { sx: e.clientX, sy: e.clientY, v: screenView(), moved: false }; return; }
      var it = C.items.find(function (x) { return x.m.id === g.getAttribute('data-mid'); });
      drag = { it: it, sx: e.clientX, sy: e.clientY, t0: T(it), pos0: JSON.parse(JSON.stringify(it.m.pos)), perp0: it.perp, moved: false, k: svgScale(svg), g: g };
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
      if (!drag || C.pick) { return; }   // picking modules for a run: no moving
      var dh = (e.clientX - drag.sx) * drag.k, dv = -(e.clientY - drag.sy) * drag.k;
      if (!drag.moved && Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) < 6) { return; }
      drag.moved = true;
      var v = V(), t0 = drag.t0, t = { x: t0.x, y: t0.y, z: t0.z };
      t[v.h[0]] += v.h[1] * dh; t[v.v[0]] += v.v[1] * dv;
      t = snap(drag.it, t, [v.h[0], v.v[0]], SNAP_PX * drag.k);
      drag.it.m.pos = JSON.parse(JSON.stringify(drag.pos0)); drag.it.perp = drag.perp0;
      applyT(drag.it, t, t0);
      var nt = T(drag.it);
      drag.g.setAttribute('transform', 'translate(' + (v.h[1] * (nt[v.h[0]] - t0[v.h[0]])) + ' ' + (-v.v[1] * (nt[v.v[0]] - t0[v.v[0]])) + ')');
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
      if (C.pick) { togglePick(d.it); return; }
      C.sel = d.it.m.id;
      if (d.moved) { save(); if (!C.view) { fitBox(); } }
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

  // ------------------------------------------------------------------ panels for a run
  // Pick the modules of a run (wall cabinets…), then the shared form (ui/runpanels.js) plans an
  // underpanel / overpanel / crown with the shared engine; they are added as panel modules.
  function frameOf(r) {
    var a = r * Math.PI / 180, c = Math.round(Math.cos(a)), sn = Math.round(Math.sin(a));
    return { o: [0, 0], u: [c, sn], n: [-sn, c] };
  }
  // a module's place in a leg frame (its turn's frame)
  function offIn(it, f) { var t = T(it); return [t.x * f.u[0] + t.y * f.u[1], t.x * f.n[0] + t.y * f.n[1], t.z]; }
  // a piece made in a leg frame (origin [x, y, z]) as a place of the site: pos { x, z, w, r }
  function posFrom(o, f, r, D) {
    var wx = f.o[0] + f.u[0] * o[0] + f.n[0] * o[1], wy = f.o[1] + f.u[1] * o[0] + f.n[1] * o[1];
    var pos = { x: Math.round(wx * 10) / 10, z: o[2], w: Math.round((wy - D) * 10) / 10 };
    if (r) { pos.r = r; }
    return pos;
  }
  function depthOf() { return C.items.reduce(function (a, it) { return it.m.params.panel || it.m.params.slab ? a : Math.max(a, Number(it.m.params.depth) || 0); }, 0); }
  function startPick(first, forComp) { C.pick = first ? [first] : []; C.pickFor = forComp ? 'comp' : 'run'; C.sel = null; draw2d(); panel(); }
  function togglePick(it) {
    if (it.m.params.panel || it.m.params.slab) { A.toast(A.t('Panels are not part of a run')); return; }
    var i = C.pick.indexOf(it.m.id);
    if (i >= 0) { C.pick.splice(i, 1); } else { C.pick.push(it.m.id); }
    draw2d(); panel();
  }
  function openRunPanels() {
    var t = A.t, D = C.D = depthOf();
    var picked = C.items.filter(function (it) { return C.pick.indexOf(it.m.id) >= 0; });
    var r0 = picked.length ? rotOf(picked[0]) : 0;
    if (picked.some(function (it) { return rotOf(it) !== r0; })) { A.toast(t('The modules of a run must face the same way.')); return; }
    var fr = frameOf(r0);
    var mods = picked.map(function (it) {
      return { code: it.code, name: it.m.params.name || '', params: it.m.params, off: offIn(it, fr) };
    });
    var run;
    try { run = Engine.call('run_measure', { mods: mods, lang: A.lang() }); } catch (e) { A.toast(e.message); return; }
    var opt = A.prefsOpt(), M = window.PPMaterials, list = M && M.engineList ? M.engineList() : [];
    var sheet = document.createElement('div');
    sheet.className = 'rp-sheet';
    sheet.innerHTML = '<div class="rp-box"></div>';
    document.body.appendChild(sheet);
    function close() { sheet.remove(); }
    sheet.addEventListener('click', function (e) { if (e.target === sheet) { close(); } });
    function withBoard(opts) {
      var lens = Object.keys(opts.pieces || {}).map(function (k) {
        var name = (opts.pieces[k] && opts.pieces[k].mat) || run.mat_front, e = list.find(function (x) { return x.name === name; });
        return e && e.sheet_l ? e.sheet_l : (opt.sheet_l || 2440);
      });
      return Object.assign({}, opts, { sheet_l: lens.length ? Math.min.apply(null, lens) : (opt.sheet_l || 2440), trim: opt.trim == null ? 10 : opt.trim });
    }
    window.PPRunPanels.render(sheet.firstChild, {
      t: t, show: function (v) { return A.L(v); }, units: A.U(), run: run, lang: A.lang(),
      parse: function (s) { var v = window.PP_CALC ? window.PP_CALC(s) : parseFloat(String(s).replace(',', '.')); return v == null || !isFinite(v) ? null : v * A.uk(); },
      mats: list.map(function (x) { return x.name; }),
      plan: function (opts, done) {
        try { done(Engine.call('run_plan', { run: run, opts: withBoard(opts), lang: A.lang() })); }
        catch (e) { done({ pieces: [], errors: [e.message], warnings: [], usable: 0, split: [] }); }
      },
      create: function (opts) {
        var res;
        try { res = Engine.call('run_plan', { run: run, opts: withBoard(opts), lang: A.lang() }); } catch (e) { A.toast(e.message); return; }
        var s = C.s, now = new Date().toISOString();
        res.pieces.forEach(function (pc) {
          var nm = { id: A.uid(), order: s.next_order++, created: now, updated: now, params: pc.params,
                     pos: posFrom(pc.origin, fr, r0, D) };
          if (C.wall) {                                  // in the room: on this wall, at its distance from it
            var w = C.wall, a = pc.origin[0], pp = pc.origin[1] + C.wallBack - D;   // (in a wall tab nothing is turned: fr is the wall's)
            nm.room = { x: w.origin[0] + w.u[0] * a + w.n[0] * pp, y: w.origin[1] + w.u[1] * a + w.n[1] * pp, z: pc.origin[2], rot: w.rot };
          }
          s.modules.push(nm);
        });
        s.updated = now; save(); close();
        C.pick = null; load(); fitBox(); redraw(false); panel();
        A.toast(t('Panels created') + ': ' + res.pieces.length);
      },
      cancel: close
    });
  }

  // ------------------------------------------------------------------ compositions
  // A composition: modules (on one wall, or turning a corner in the room) with pieces made for them
  // by the shared engine (core/composition.rb): a stone or wood top, a back panel, side panels.
  // Kept with the site: s.comps = [{ id, mods: [module ids], opts, pieces: [module ids], sig }]. The
  // pieces are ordinary modules of the site; they are made again whenever the modules change.
  function compOf(id) {
    return (C.s.comps || []).find(function (c) { return c.mods.indexOf(id) >= 0 || c.pieces.indexOf(id) >= 0; }) || null;
  }
  function modById(id) { return C.s.modules.find(function (m) { return m.id === id; }) || null; }
  function compSig(c) {
    return JSON.stringify(c.mods.map(function (id) {
      var m = modById(id);
      return m ? [m.params, m.room || (m.pos ? [m.pos.x, m.pos.z, m.pos.w, m.pos.r, m.pos.wy] : null)] : null;
    }));
  }
  // The modules in legs (one per wall) with their places, and where a leg's pieces go.
  function compLegs(ids) {
    var legs = [], places = [];
    if (C.room) {
      C.room.walls.forEach(function (w) {
        var mods = w.mods.filter(function (wm) { return ids.indexOf(wm.id) >= 0; }).map(function (wm) {
          var it = C.all.find(function (x) { return x.m.id === wm.id; });
          return it ? { code: it.code, id: it.m.id, params: it.m.params, off: [wm.along, wm.perp, wm.z] } : null;
        }).filter(Boolean);
        if (mods.length) { legs.push({ mods: mods, frame: { o: w.origin, u: w.u, n: w.n } }); places.push({ w: w }); }
      });
    } else {
      var D = C.D = depthOf(), byR = {};
      C.all.filter(function (it) { return ids.indexOf(it.m.id) >= 0 && it.m.pos; }).forEach(function (it) {
        var r = rotOf(it);
        (byR[r] = byR[r] || []).push(it);
      });
      Object.keys(byR).sort(function (a, b) { return a - b; }).forEach(function (k) {
        var r = Number(k), f = frameOf(r);
        legs.push({ mods: byR[k].map(function (it) { return { code: it.code, id: it.m.id, params: it.m.params, off: offIn(it, f) }; }), frame: f });
        places.push({ D: D, f: f, r: r });
      });
    }
    return { legs: legs, places: places };
  }
  function boardOpts(opts) {
    var o = A.prefsOpt() || {};
    return Object.assign({}, opts, { sheet_l: o.sheet_l || 2440, trim: o.trim == null ? 10 : o.trim });
  }
  function compPlan(c, opts) {
    var L = compLegs(c.mods);
    if (!L.legs.length) { throw new Error(A.t('The modules of this composition are no longer in the site.')); }
    return { L: L, res: Engine.call('comp_plan', { legs: L.legs, opts: boardOpts(opts), lang: A.lang() }) };
  }
  // Make the pieces again (opts: new choices); the modules' own stone tops are switched off.
  function applyComp(c, opts) {
    var r = compPlan(c, opts), s = C.s, now = new Date().toISOString();
    s.modules = s.modules.filter(function (m) { return c.pieces.indexOf(m.id) < 0; });
    (r.res.stone_off || []).forEach(function (id) {
      var m = modById(id);
      if (m && m.params.stone) { m.params = A.normalize(Object.assign({}, m.params, { stone: false })); m.updated = now; }
    });
    c.pieces = [];
    r.res.pieces.forEach(function (pc) {
      var o = pc.origin, pl = r.L.places[pc.leg] || r.L.places[0];
      var nm = { id: A.uid(), order: s.next_order++, created: now, updated: now, params: pc.params, comp: c.id };
      if (pl.w) {
        var w = pl.w;
        nm.room = { x: Math.round((w.origin[0] + w.u[0] * o[0] + w.n[0] * o[1]) * 10) / 10, y: Math.round((w.origin[1] + w.u[1] * o[0] + w.n[1] * o[1]) * 10) / 10, z: o[2], rot: w.rot };
      } else {
        nm.pos = posFrom(o, pl.f, pl.r, pl.D);
      }
      s.modules.push(nm);
      c.pieces.push(nm.id);
    });
    c.opts = opts;
    c.sig = compSig(c);
    s.updated = now;
    return r.res;
  }
  // Compositions whose modules changed (or went): pieces made again / composition removed.
  function refreshComps() {
    var s = C.s, changed = false;
    if (!s.comps || !s.comps.length) { return false; }
    s.comps = s.comps.filter(function (c) {
      c.mods = c.mods.filter(function (id) { return !!modById(id); });
      if (c.mods.length) { return true; }
      s.modules = s.modules.filter(function (m) { return c.pieces.indexOf(m.id) < 0; });
      changed = true;
      return false;
    });
    s.comps.forEach(function (c) {
      if (c.sig === compSig(c)) { return; }
      try { applyComp(c, c.opts || {}); } catch (e) { c.sig = compSig(c); }
      changed = true;
    });
    return changed;
  }
  function openComp(c) {
    var t = A.t, isNew = !c;
    if (isNew) {
      if (!C.pick || !C.pick.length) { return; }
      c = { id: A.uid(), mods: C.pick.slice(), opts: {}, pieces: [], sig: '' };
    }
    var M = window.PPMaterials, list = M && M.engineList ? M.engineList() : [];
    var sheet = document.createElement('div');
    sheet.className = 'rp-sheet';
    sheet.innerHTML = '<div class="rp-box"></div>';
    document.body.appendChild(sheet);
    function close() { sheet.remove(); }
    sheet.addEventListener('click', function (e) { if (e.target === sheet) { close(); } });
    window.PPCompForm.render(sheet.firstChild, {
      t: t, show: function (v) { return A.L(v); }, units: A.U(), lang: A.lang(), opts: c.opts, focus: isNew ? 'stone' : null,
      name: t('Composition') + ' · ' + c.mods.length + ' ' + t('modules'),
      parse: function (x) { var v = window.PP_CALC ? window.PP_CALC(x) : parseFloat(String(x).replace(',', '.')); return v == null || !isFinite(v) ? null : v * A.uk(); },
      mats: list.map(function (x) { return x.name; }),
      plan: function (opts, done) {
        try { done(compPlan(c, opts).res); } catch (e) { done({ pieces: [], segs: [], corners: [], errors: [e.message], warnings: [] }); }
      },
      apply: function (opts) {
        var res;
        try { res = applyComp(c, opts); } catch (e) { A.toast(e.message); return; }
        if (isNew) { C.s.comps = (C.s.comps || []).concat([c]); }
        if (!opts.top && !opts.back && !opts.sides) {        // nothing left: no composition
          C.s.comps = C.s.comps.filter(function (x) { return x !== c; });
        }
        A.persist(); close();
        C.pick = null; C.pickFor = null; load(); fitBox(); redraw(false); panel(); histPush();
        A.toast(t('Pieces') + ': ' + res.pieces.length);
      },
      cancel: close
    });
  }
  // From other screens (a module of the site was edited or removed): pieces made again.
  function refreshSite(s) {
    if (!s || !s.comps || !s.comps.length) { return false; }
    var keep = C;
    A = window.PPApp;
    C = { s: s, items: [], refreshing: true };
    var changed = false;
    try { load0(); changed = refreshComps(); } catch (e) { changed = false; }
    C = keep;
    return changed;
  }

  // ------------------------------------------------------------------ 3D
  // the whole room: every module turned and moved to its own place
  function draw3dRoom() {
    var parts = [], movers = [], places = {};
    C.all.forEach(function (it) {
      var r = it.m.room, pre = it.m.id + ':';
      if (!r || !it.res) { return; }
      places[it.m.id] = { x: r.x, y: r.y, z: r.z, rz: r.rot };
      it.res.parts.forEach(function (q) { var c = Object.assign({}, q, { grp: it.m.id }); if (q.mover) { c.mover = pre + q.mover; } parts.push(c); });
      (it.res.movers || []).forEach(function (m) { movers.push(Object.assign({}, m, { id: pre + m.id, grp: it.m.id })); });
    });
    P3D.update(parts, A.matInfo, movers, places);
  }
  function draw3d(reset) {
    if (!A.has3d()) { return; }
    if (isAll()) { draw3dRoom(); if (reset) { P3D.reset('iso'); } return; }
    C.D = depthOf();
    var pp = placedParts();
    P3D.update(pp.parts, A.matInfo, pp.movers, pp.places);
    if (reset) { P3D.reset('iso'); }
  }

  // ------------------------------------------------------------------ screen
  function panel() {
    var box = document.getElementById('cpanel');
    if (!box) { return; }
    var t = A.t, esc = A.esc;
    if (C.pick) {
      box.innerHTML = '<p class="meta-line">' + esc(t(C.pickFor === 'comp' ? (C.room ? 'Tap the modules of the composition (on every wall it covers), then Next.' : 'Tap the modules of the composition, then Next.') : 'Tap the modules of the run, then Next.')) + '</p>' +
        '<div class="crow"><b class="grow">' + C.pick.length + ' ' + esc(t('selected')) + '</b>' +
        '<button type="button" class="btn small" id="cPickNo">' + esc(t('Cancel')) + '</button>' +
        '<button type="button" class="btn small primary" id="cPickGo"' + (C.pick.length ? '' : ' disabled') + '>' + esc(t('Next')) + '</button></div>';
      document.getElementById('cPickNo').onclick = function () { C.pick = null; draw2d(); panel(); };
      document.getElementById('cPickGo').onclick = C.pickFor === 'comp' ? function () { openComp(null); } : openRunPanels;
      return;
    }
    if (isAll()) {
      box.innerHTML = '<p class="meta-line">' + esc(t('The whole room as placed in SketchUp. Open a wall to move its modules along it.')) + '</p>' +
        C.room.walls.map(function (w, i) {
          return '<div class="crow"><b class="grow">' + esc(w.name) + '</b><span class="muted">' + w.mods.length + ' ' + esc(t('modules')) + ' · ' + esc(A.LU(w.length)) + '</span>' +
            '<button type="button" class="btn small" data-wall="' + i + '">' + esc(t('Open wall')) + '</button></div>';
        }).join('');
      box.querySelectorAll('[data-wall]').forEach(function (b) { b.onclick = function () { setTab(Number(b.getAttribute('data-wall'))); }; });
      return;
    }
    var it = C.items.find(function (x) { return x.m.id === C.sel; });
    if (!it) {
      box.innerHTML = '<p class="meta-line">' + esc(t(C.items.length ? 'Drag modules to arrange them: they snap to the floor, the wall, side by side and on top of each other. Switch the view (front, sides, back, top) to line them up. Tap one to type its position or turn it.' : 'Add modules to the site first.')) + '</p>';
      return;
    }
    var w = wbox(it), gap = Math.round((C.D - w.y1) * 10) / 10;
    box.innerHTML = '<div class="crow"><span class="code">' + esc(it.code) + '</span><b class="grow">' + esc(it.m.params.name || '') + '</b>' +
      '<span class="muted">' + esc(A.dimsOf(it.m.params)) + '</span></div>' +
      '<div class="crow"><span class="flbl">' + esc(t('From the left')) + '</span><button type="button" class="valbtn" data-cpos="x">' + esc(A.LU(w.x0)) + '</button></div>' +
      '<div class="crow"><span class="flbl">' + esc(t('Off the floor')) + '</span><button type="button" class="valbtn" data-cpos="z">' + esc(A.LU(w.z0)) + '</button></div>' +
      '<div class="crow"><span class="flbl">' + esc(t('From the wall')) + '</span><button type="button" class="valbtn" data-cpos="y">' + esc(A.LU(gap)) + '</button></div>' +
      (it.m.params.panel ? '<div class="crow seg cturn">' + [['top', 'Flat (over a module)'], ['side', 'On edge (beside a module)'], ['filler', 'Upright (front / gap)']].map(function (o) {
        var k = { back: 'filler', crown: 'filler', bottom: 'top' }[it.m.params.panel_kind] || it.m.params.panel_kind;
        return '<button type="button" data-turn="' + o[0] + '" aria-pressed="' + (k === o[0]) + '">' + esc(t(o[1])) + '</button>';
      }).join('') + '</div>' : '') +
      '<div class="crow"><button type="button" class="btn small" id="cEdit" style="flex:1">' + esc(t('Edit module')) + '</button>' +
      '<button type="button" class="btn small" id="cFloor" style="flex:1">' + esc(t('Put on the floor')) + '</button>' +
      '<button type="button" class="btn small" id="cTurn" style="flex:1">↻ ' + esc(t('Turn 90°')) + '</button></div>' +
      (it.m.params.panel || it.m.params.slab ? '' : '<div class="crow"><button type="button" class="btn small" id="cRun" style="flex:1">' + esc(t('Panels for a run…')) + '</button></div>') +
      (compOf(it.m.id) ? '<div class="crow"><button type="button" class="btn small" id="cComp" style="flex:1">' + esc(t('Composition: top, back and side panels…')) + '</button></div>' : '');
    box.querySelectorAll('[data-cpos]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-cpos');
        var o = turnedBox(it);
        A.openPad({ label: t({ x: 'From the left', z: 'Off the floor', y: 'From the wall' }[k]), value: k === 'x' ? w.x0 : k === 'z' ? w.z0 : gap, allowZero: true, done: function (v) {
          if (k === 'x') { it.m.pos.x = v - o.x0; } else if (k === 'z') { it.m.pos.z = v - o.z0; } else { setY(it, C.D - v - o.y1); }
          save(); fitBox(); redraw(false); panel();
        } });
      };
    });
    box.querySelectorAll('[data-turn]').forEach(function (b) {
      b.onclick = function () { turnPanel(it, b.getAttribute('data-turn')); };
    });
    document.getElementById('cEdit').onclick = function () { A.go('#/site/' + encodeURIComponent(C.s.id) + '/m/' + encodeURIComponent(it.m.id)); };
    document.getElementById('cFloor').onclick = function () { var t0 = T(it); it.m.pos.z = -it.bb.z0; if (it.m.pos.wy != null) { setY(it, t0.y); } save(); fitBox(); redraw(false); panel(); };
    document.getElementById('cTurn').onclick = function () { turn(it); };
    var rb = document.getElementById('cRun');
    if (rb) { rb.onclick = function () { startPick(it.m.id); }; }
    var cb = document.getElementById('cComp');
    if (cb) { cb.onclick = function () { openComp(compOf(it.m.id)); }; }
  }

  // Turn a module 90° (seen from above) about its middle. In a SketchUp room it then stands on
  // another wall (the walls are worked out again).
  function turn(it) {
    var b = refBox(it), c = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
    if (C.room) {
      syncRoom();
      var rm = it.m.room, a0 = (Number(rm.rot) || 0) * Math.PI / 180, a1 = a0 + Math.PI / 2;
      var wc = [rm.x + c[0] * Math.cos(a0) - c[1] * Math.sin(a0), rm.y + c[0] * Math.sin(a0) + c[1] * Math.cos(a0)];
      it.m.room = { x: Math.round((wc[0] - (c[0] * Math.cos(a1) - c[1] * Math.sin(a1))) * 10) / 10,
                    y: Math.round((wc[1] - (c[0] * Math.sin(a1) + c[1] * Math.cos(a1))) * 10) / 10,
                    z: rm.z, rot: ((Number(rm.rot) || 0) + 90) % 360 };
      A.persist(); histPush(); shareKick();
      var id = it.m.id;
      load();
      var wi = C.room ? C.room.walls.findIndex(function (w) { return w.mods.some(function (x) { return x.id === id; }); }) : -1;
      if (wi >= 0 && wi !== C.tab) { C.sel = id; setTab(wi); C.sel = id; panel(); A.toast(A.t('Turned: it now stands on another wall.')); }
      else { C.sel = id; fitBox(); redraw(false); panel(); A.toast(A.t('Turned 90°.')); }
      return;
    }
    var r0 = rotOf(it), r1 = (r0 + 90) % 360, t = T(it);
    var q0 = rot2(r0, c[0], c[1]), q1 = rot2(r1, c[0], c[1]);
    it.m.pos.x = Math.round((t.x + q0[0] - q1[0]) * 10) / 10;
    if (r1) { it.m.pos.r = r1; } else { delete it.m.pos.r; }
    setY(it, t.y + q0[1] - q1[1]);
    save(); fitBox(); redraw(false); panel();
  }

  // Turn a loose panel: its two face sizes move to the new orientation (the length stays the
  // length), the thickness becomes the third size. The engine re-normalizes it.
  function turnPanel(it, kind) {
    var p = it.m.params, k = p.panel_kind;
    var a = k === 'top' || k === 'bottom' ? [p.width, p.depth] : k === 'side' ? [p.height, p.depth] : [p.width, p.height];
    var len = Math.max(a[0], a[1]), wid = Math.min(a[0], a[1]);
    var q = Object.assign({}, p, { panel_kind: kind === 'filler' && (k === 'back' || k === 'crown') ? k : kind === 'top' && k === 'bottom' ? 'bottom' : kind });
    if (kind === 'top') { q.width = len; q.depth = wid; }
    else if (kind === 'side') { q.height = len; q.depth = wid; }
    else { q.width = len; q.height = wid; }
    var w0 = wbox(it), t0 = T(it);
    it.m.params = A.normalize(q);
    it.m.updated = new Date().toISOString();
    it.res = A.buildModule(it.m); it.bb = bboxOf(it.res);
    var o = turnedBox(it), keep = it.m.pos;
    it.m.pos = { x: w0.x0 - o.x0, z: w0.z0 - o.z0 };   // keep its bottom-left corner where it was (and back to the wall)
    if (keep.r) { it.m.pos.r = keep.r; }
    if (keep.w != null || keep.wy != null) { setY(it, t0.y); }
    save(); fitBox(); redraw(false); panel();
  }

  function tabsHtml() {
    if (!C.room) { return ''; }
    var t = A.t, esc = A.esc;
    return '<div class="ctabs seg">' + C.room.walls.map(function (w, i) {
      return '<button type="button" data-ctab="' + i + '" aria-pressed="' + (C.tab === i) + '">' + esc(w.name) + '</button>';
    }).join('') + '<button type="button" data-ctab="all" aria-pressed="' + (C.tab === 'all') + '">' + esc(t('Whole room')) + '</button></div>';
  }
  function setTab(k) {
    C.tab = k; C.sel = null;
    if (C.pickFor !== 'comp') { C.pick = null; }   // a composition can turn a corner: its modules are picked on every wall
    pickTab();
    var bar = document.getElementById('ctabs');
    if (bar) { bar.innerHTML = tabsHtml(); wireTabs(); }
    fitBox(); redraw(true); panel();
  }
  function wireTabs() {
    document.querySelectorAll('[data-ctab]').forEach(function (b) {
      b.onclick = function () { var k = b.getAttribute('data-ctab'); setTab(k === 'all' ? 'all' : Number(k)); };
    });
  }

  function redraw(reset) {
    var host = document.getElementById('cview');
    if (!host) { return; }
    host.classList.toggle('is2d', C.mode === '2d');
    document.getElementById('cMode').querySelector('.vt-t').textContent = C.mode === '2d' ? '3D' : '2D';
    document.getElementById('cOpen').hidden = C.mode !== '3d';
    var sb = document.getElementById('cSides');
    if (sb) { sb.hidden = C.mode !== '2d' || !!isAll(); }
    if (C.mode === '2d') { draw2d(); } else { P3D.resize(); draw3d(reset); }
  }

  function render(s) {
    A = window.PPApp;
    var t = A.t, esc = A.esc;
    var keep = C && C.s === s;
    C = { s: s, items: [], sel: keep ? C.sel : null, tab: keep ? C.tab : null, pick: null, mode: A.has3d() ? A.loadPref('panelpro.web.cmode', '2d') : '2d',
          side: VIEWS[A.loadPref('panelpro.web.cside', 'front')] ? A.loadPref('panelpro.web.cside', 'front') : 'front',
          hist: keep ? C.hist : null, hi: keep ? C.hi : 0 };
    load();
    if (!C.hist) { C.hist = [histSnap()]; C.hi = 0; }
    fitBox();
    A.show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(t('Composition')) + '<span class="sub">' + esc(s.name) + '</span></h1>' +
      '<button type="button" class="icon-btn" id="cMore" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="compose"><div class="cview view3d" id="cview"><div id="ctabs">' + tabsHtml() + '</div><svg id="csvg" class="csvg" preserveAspectRatio="xMidYMid meet"></svg>' +
      '<div class="side-bar" id="cSides" role="tablist">' + ['front', 'right', 'back', 'left', 'top'].map(function (k) {
        return '<button type="button" data-cside="' + k + '" aria-pressed="' + (C.side === k) + '">' + esc(A.sideLabel(k)) + '</button>';
      }).join('') + '</div>' +
      '<div class="dim-note" id="cNote">' + esc(t('Dimensions in ' + A.U())) + '</div>' +
      '<div class="view-tools"><button type="button" id="cMode" class="vt vt-txt" data-label="2D / 3D" aria-label="2D / 3D"><b class="vt-t">3D</b>' + A.vtTip('2D / 3D') + '</button>' + A.vtBtn('cOpen', 'open', t('Open all'), ' aria-pressed="false"') +
      A.diagBtn() + A.vtBtn('cUndo', 'undo', t('Undo') + ' (Ctrl+Z)') + A.vtBtn('cRedo', 'redo', t('Redo') + ' (Ctrl+Shift+Z)') + A.vtBtn('cRender', 'render', t('Render (AI)')) + A.vtBtn('cShare', 'share', t('Share 3D view')) + A.vtBtn('cFit', 'fit', t('Fit')) + '</div></div>' +
      '<div class="cpanel" id="cpanel"></div></div>'
    );
    var host = document.getElementById('cview');
    host.insertBefore(A.viewer(), host.firstChild);
    document.getElementById('back').onclick = function () { history.back(); };
    document.getElementById('cMode').onclick = function () {
      if (!A.has3d()) { return; }
      C.mode = C.mode === '2d' ? '3d' : '2d'; A.savePref('panelpro.web.cmode', C.mode); redraw(true);
    };
    document.querySelectorAll('[data-cside]').forEach(function (b) {
      b.onclick = function () {
        C.side = b.getAttribute('data-cside'); A.savePref('panelpro.web.cside', C.side);
        document.querySelectorAll('[data-cside]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        fitBox(); draw2d();
      };
    });
    document.getElementById('cFit').onclick = function () { if (C.mode === '2d') { fitBox(); draw2d(); } else { P3D.zoomExtents(); } };
    document.getElementById('cOpen').onclick = function () { var o = P3D.toggle('all'); A.setOpenBtn(this, o); };
    A.wireDiag();
    document.getElementById('cUndo').onclick = function () { undo(-1); };
    document.getElementById('cRedo').onclick = function () { undo(1); };
    undoState();
    document.getElementById('cShare').onclick = function () { A.openShare(C.s, shareTarget(), 'comp', shareTitle(), shareData); };
    if (C.s.shares && C.s.shares[shareTarget()]) { setTimeout(shareKick, 1500); }
    // came from the project's Share › 3D view: open the share window straight away
    if (A.openRender.shareNext) { A.openRender.shareNext = false; setTimeout(function () { document.getElementById('cShare').click(); }, 300); }
    document.getElementById('cRender').onclick = function () {
      A.openRender.target = shareTarget();
      if (!A.has3d()) { A.toast(t('The 3D view is not available on this device.')); return; }
      if (C.mode !== '3d') { C.mode = '3d'; A.savePref('panelpro.web.cmode', '3d'); redraw(true); }
      A.openRender(C.s, t('Composition') + ' · ' + C.s.name, C.items.map(function (it) { return it.m.params; }), function () {
        var e = extents(), d = C.items.reduce(function (a, it) { return Math.max(a, it.bb ? it.bb.y1 - it.bb.y0 : 0); }, 0);
        return { w: e.x1 - e.x0, h: e.z1 - e.z0, d: d };
      });
    };
    document.getElementById('cMore').onclick = function () {
      if (isAll()) { A.toast(t('Open a wall first.')); return; }
      var list = [{ label: t('Panels for a run…'), icon: 'runpanels', run: function () { startPick(null); } },
                  { label: t('New composition: top, back and side panels…'), icon: 'runpanels', run: function () { startPick(null, true); } }];
      (C.s.comps || []).forEach(function (c, i) {
        list.push({ label: t('Composition') + ' ' + (i + 1) + ' (' + c.mods.length + ' ' + t('modules') + ')…', icon: 'runpanels', run: function () { openComp(c); } });
      });
      if (!C.room) {
        list.push({ label: t('Arrange again side by side'), icon: 'layout', run: function () {
          C.items.forEach(function (it) { delete it.m.pos; }); autoPlace(C.items); save(); fitBox(); redraw(true); panel();
        } });
      }
      A.menu(t('Composition'), list);
    };
    wireTabs();
    wire2d(document.getElementById('csvg'));
    fitBox();                                       // again, now that the drawing area has its size
    if (A.has3d()) { P3D.setDimUnits(A.uk(), A.U()); P3D.setDims(A.dimsShown()); }
    redraw(true);
    panel();
  }

  window.PPCompose = { render: render, refresh: refreshSite, undo: function (d) { undo(d); } };
})();
