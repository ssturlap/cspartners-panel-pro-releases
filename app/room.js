/* CSPARTNERS PANEL PRO — the room as drawings: the plan from above (every module's outline and
 * code, the walls, the overall size) and one elevation per wall (modules from the front, codes,
 * widths and heights). Used by the web composition and by the module manual. Input comes from
 * the shared engine (core/room.rb: Room.layout); module fronts from PPReports.frontPoly.
 *
 *   PPRoom.planSvg(layout, ctx)          ctx: { t, show, esc }
 *   PPRoom.wallSvg(wall, mods, ctx)      mods: id → { parts, code }
 */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function n1(v) { return Math.round(v * 10) / 10; }
  var COLORS = ['#d9e6ec', '#f3e3c2', '#dfe8d4', '#ecd9e4', '#e3dcf0', '#f0dcd2'];

  // a dimension line with ticks and a label (svg units = mm)
  function dim(x1, y1, x2, y2, txt, fs, side) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * side, ny = dx / L * side, tk = fs * 0.35;
    var mx = (x1 + x2) / 2 + nx * fs * 0.9, my = (y1 + y2) / 2 + ny * fs * 0.9, ang = Math.atan2(dy, dx) * 180 / Math.PI;
    if (ang > 90 || ang < -90) { ang += 180; }
    return '<g class="dim"><line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x2) + '" y2="' + n1(y2) + '"/>' +
      '<line x1="' + n1(x1 - tk) + '" y1="' + n1(y1 + tk) + '" x2="' + n1(x1 + tk) + '" y2="' + n1(y1 - tk) + '"/>' +
      '<line x1="' + n1(x2 - tk) + '" y1="' + n1(y2 + tk) + '" x2="' + n1(x2 + tk) + '" y2="' + n1(y2 - tk) + '"/>' +
      '<text x="' + n1(mx) + '" y="' + n1(my) + '" font-size="' + n1(fs) + '" transform="rotate(' + n1(ang) + ' ' + n1(mx) + ' ' + n1(my) + ')">' + esc(txt) + '</text></g>';
  }
  var STYLE = '<style>.dim line{stroke:#1d2a30;stroke-width:1.2;vector-effect:non-scaling-stroke}.dim text{fill:#1d2a30;text-anchor:middle;dominant-baseline:middle;font-family:Helvetica,Arial,sans-serif;font-weight:600}' +
    '.fp{stroke:#3b4a50;stroke-width:1.2;vector-effect:non-scaling-stroke}.fr{stroke:#b4532a;stroke-width:3;vector-effect:non-scaling-stroke}' +
    '.cd{font-family:Helvetica,Arial,sans-serif;font-weight:700;fill:#1d2a30;text-anchor:middle;dominant-baseline:middle}' +
    '.wl{font-family:Helvetica,Arial,sans-serif;font-weight:700;fill:#b4532a;text-anchor:middle;dominant-baseline:middle}' +
    '.pt{stroke:#3b4a50;stroke-width:.8;vector-effect:non-scaling-stroke}</style>';

  // ---- plan from above: y goes up in the room, down in SVG
  function planSvg(L, ctx) {
    if (!L || !L.box) { return ''; }
    var b = L.box, W = b[2] - b[0], H = b[3] - b[1], fs = Math.max(W, H) / 38, pad = fs * 8;
    var out = [STYLE];
    // wall cabinets drawn dashed over the bases
    var plan = L.plan.slice().sort(function (a, c) { return a.z - c.z; });
    plan.forEach(function (p) {
      var high = p.z > 900, pts = p.pts.map(function (q) { return n1(q[0]) + ',' + n1(-q[1]); }).join(' ');
      out.push('<polygon class="fp" points="' + pts + '" fill="' + (high ? 'none' : COLORS[p.wall % COLORS.length]) + '"' + (high ? ' stroke-dasharray="6 5"' : '') + '/>');
      if (!high) { out.push('<line class="fr" x1="' + n1(p.front[0][0]) + '" y1="' + n1(-p.front[0][1]) + '" x2="' + n1(p.front[1][0]) + '" y2="' + n1(-p.front[1][1]) + '"/>'); }
    });
    // codes: base modules near their front, wall cabinets (dashed) at their own middle
    plan.forEach(function (p) {
      var high = p.z > 900, f = high ? 0.5 : 0.3;
      var fx = (p.pts[0][0] + p.pts[1][0]) / 2, fy = (p.pts[0][1] + p.pts[1][1]) / 2, bx = (p.pts[2][0] + p.pts[3][0]) / 2, by = (p.pts[2][1] + p.pts[3][1]) / 2;
      var cx = fx + (bx - fx) * f, cy = fy + (by - fy) * f;
      out.push('<text class="cd" x="' + n1(cx) + '" y="' + n1(-cy) + '" font-size="' + n1(high ? fs * 0.8 : fs) + '"' + (high ? ' fill-opacity=".7"' : '') + '>' + esc(p.code) + '</text>');
    });
    // wall names behind each wall's line
    L.walls.forEach(function (w) {
      var mods = L.plan.filter(function (p) { return p.wall === w.id; });
      if (!mods.length) { return; }
      var cx = 0, cy = 0, c = 0;
      mods.forEach(function (p) { [p.pts[2], p.pts[3]].forEach(function (q) { cx += q[0]; cy += q[1]; c++; }); });
      cx /= c; cy /= c;
      out.push('<text class="wl" x="' + n1(cx + w.n[0] * fs * 2.4) + '" y="' + n1(-(cy + w.n[1] * fs * 2.4)) + '" font-size="' + n1(fs * 0.85) + '">' + esc(w.name) + '</text>');
    });
    // overall size
    out.push(dim(b[0], -b[1] + fs * 5.6, b[2], -b[1] + fs * 5.6, ctx.show(W), fs * 0.9, 1));
    out.push(dim(b[0] - fs * 5.6, -b[1], b[0] - fs * 5.6, -b[3], ctx.show(H), fs * 0.9, -1));
    var vb = [b[0] - pad, -b[3] - pad, W + 2 * pad, H + 2 * pad].map(n1).join(' ');
    return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + out.join('') + '</svg>';
  }

  // ---- one wall from the front
  function wallSvg(w, mods, ctx) {
    var R = window.PPReports, out = [STYLE];
    var x0 = 1e9, x1 = -1e9, z0 = 0, z1 = 0;
    w.mods.forEach(function (m) {
      var M = mods[m.id];
      if (!M) { return; }
      var bb = M.bb || [[0, 0, 0], [0, 0, 0]];
      x0 = Math.min(x0, m.x0); x1 = Math.max(x1, m.x1); z1 = Math.max(z1, m.z + bb[1][2]); z0 = Math.min(z0, m.z + bb[0][2]);
    });
    if (x0 > x1) { return ''; }
    var W = x1 - x0, H = z1 - z0, fs = Math.max(W, H) / 40;
    w.mods.forEach(function (m) {
      var M = mods[m.id];
      if (!M) { return; }
      var g = '<g transform="translate(' + n1(m.along - x0) + ' ' + n1(-m.z) + ')">';
      (M.parts || []).slice().sort(function (a, c) { return R.ORDER.indexOf(a.role) - R.ORDER.indexOf(c.role); }).forEach(function (p) {
        var q = R.frontPoly(p);
        if (q) { g += '<polygon class="pt" fill="' + (p.role === 'front' ? '#e9edef' : p.role === 'base' ? '#9aa4a8' : '#f7f3ec') + '" points="' + q.map(function (k) { return n1(k[0]) + ',' + n1(-k[1]); }).join(' ') + '"/>'; }
      });
      var bb = M.bb || [[0, 0, 0], [0, 0, 0]], cx = (bb[0][0] + bb[1][0]) / 2, cz = (bb[0][2] + bb[1][2]) / 2;
      g += '<circle cx="' + n1(cx) + '" cy="' + n1(-cz) + '" r="' + n1(fs * 1.05) + '" fill="#fff" stroke="#b4532a" stroke-width="2" vector-effect="non-scaling-stroke"/>' +
        '<text class="cd" x="' + n1(cx) + '" y="' + n1(-cz) + '" font-size="' + n1(fs * 0.85) + '">' + esc(M.code || m.code || '') + '</text></g>';
      out.push(g);
    });
    // floor line, widths under each module (bases and uppers in two rows), overall length, heights
    out.push('<line x1="' + n1(-fs) + '" y1="0" x2="' + n1(W + fs) + '" y2="0" stroke="#1d2a30" stroke-width="2" vector-effect="non-scaling-stroke"/>');
    var low = w.mods.filter(function (m) { return m.z < 900; }), high = w.mods.filter(function (m) { return m.z >= 900; });
    low.forEach(function (m) { out.push(dim(m.x0 - x0, fs * 1.6, m.x1 - x0, fs * 1.6, ctx.show(m.x1 - m.x0), fs * 0.8, 1)); });
    high.forEach(function (m) {
      var M = mods[m.id], top = m.z + ((M && M.bb) ? M.bb[1][2] : 0);
      out.push(dim(m.x0 - x0, -top - fs * 1.4, m.x1 - x0, -top - fs * 1.4, ctx.show(m.x1 - m.x0), fs * 0.8, -1));
    });
    out.push(dim(0, fs * 4, W, fs * 4, ctx.show(W), fs, 1));
    out.push(dim(-fs * 2.4, 0, -fs * 2.4, -z1, ctx.show(z1), fs * 0.9, 1));
    var vb = [-fs * 5, -z1 - fs * 4, W + fs * 7, z1 - z0 + fs * 10].map(n1).join(' ');
    return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + out.join('') + '</svg>';
  }

  window.PPRoom = { planSvg: planSvg, wallSvg: wallSvg };
})();
