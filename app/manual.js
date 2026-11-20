/* CSPARTNERS PANEL PRO — module manual: a printable document (Letter) with a cover,
 * one spec page per module and a project parts page.
 *
 * Each module page: header (code, name, type, size, materials, counts), six flat views
 * drawn from the builder's parts (front, front without doors / drawer fronts, left,
 * right, back, top) with overall dimension lines and each panel's size on its face,
 * two 3D pictures (closed / open) and the hardware list. The drawings are vector (SVG)
 * in millimetres, so the numbers are the same as the cut list.
 *
 * window.PPManual.build(data, ctx) → HTML string. ctx: { t, show, units, mats, esc }.
 */
(function () {
  'use strict';
  var PLANE = { x: ['y', 'z'], y: ['x', 'z'], z: ['x', 'y'] };
  var IDX = { x: 0, y: 1, z: 2 };

  function to3(axis, w, u, v) {
    if (axis === 'x') { return [w, u, v]; }
    if (axis === 'y') { return [u, w, v]; }
    return [u, v, w];
  }

  // 3D box of a part: { mn: [x, y, z], mx: [x, y, z] }
  function box(p) {
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    if (p.shape === 'cyl') {
      var a = IDX[p.axis];
      for (var i = 0; i < 3; i++) {
        mn[i] = p.center[i] - (i === a ? 0 : p.r);
        mx[i] = p.center[i] + (i === a ? p.len : p.r);
      }
      return { mn: mn, mx: mx };
    }
    p.pts.forEach(function (q) {
      [to3(p.axis, p.pos, q[0], q[1]), to3(p.axis, p.pos + p.thk, q[0], q[1])].forEach(function (c) {
        for (var i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], c[i]); mx[i] = Math.max(mx[i], c[i]); }
      });
    });
    return { mn: mn, mx: mx };
  }

  // Views: h / v = the drawing's horizontal / vertical axes (hs = −1 mirrors), d = the
  // viewing direction, s = which side the viewer stands on (−1 = the low side).
  var VIEWS = {
    front: { h: 'x', hs: 1, v: 'z', d: 'y', s: -1 },
    back: { h: 'x', hs: -1, v: 'z', d: 'y', s: 1 },
    left: { h: 'y', hs: -1, v: 'z', d: 'x', s: -1 },
    right: { h: 'y', hs: 1, v: 'z', d: 'x', s: 1 },
    top: { h: 'x', hs: 1, v: 'y', d: 'z', s: 1 }
  };

  function fmtN(v) { return String(Math.round(v * 10) / 10); }

  // One flat view as SVG (millimetres). Parts are painted far to near with a white fill,
  // so nearer panels hide what is behind them; panels facing the viewer get "W × H".
  function viewSVG(parts, key, ctx, opts) {
    var V = VIEWS[key], hi = IDX[V.h], vi = IDX[V.v], di = IDX[V.d];
    var items = parts.filter(function (p) { return !p.deco; }).map(function (p) { return { p: p, b: box(p) }; });   // hangers: 3D only
    if (!items.length) { return ''; }
    items.sort(function (a, b) {
      return V.s < 0 ? b.b.mn[di] - a.b.mn[di] : a.b.mx[di] - b.b.mx[di];
    });
    var X0 = 1e9, X1 = -1e9, Y0 = 1e9, Y1 = -1e9;
    function X(c) { return V.hs * c[hi]; }
    function Y(c) { return -c[vi]; }
    items.forEach(function (it) {
      [it.b.mn, it.b.mx].forEach(function (c) {
        X0 = Math.min(X0, X(c)); X1 = Math.max(X1, X(c)); Y0 = Math.min(Y0, Y(c)); Y1 = Math.max(Y1, Y(c));
      });
    });
    var W = X1 - X0, H = Y1 - Y0, big = Math.max(W, H, 200);
    var fs = big * 0.055, m = fs * 4.0, sw = big * 0.0022;
    var out = [];
    items.forEach(function (it) {
      var p = it.p, hw = p.role === 'hardware', front = p.role === 'front';
      var fill = hw ? '#d4d4d4' : front ? '#f1ece3' : p.role === 'base' ? '#e4e0d8' : '#ffffff';
      var stroke = hw ? '#8a8a8a' : '#2a2723';
      var facing = p.shape !== 'cyl' && p.axis === V.d;
      var rx0, rx1, ry0, ry1;
      if (p.shape === 'cyl' && p.axis === V.d) {
        var cx = V.hs * p.center[hi], cy = -p.center[vi];
        out.push('<circle cx="' + fmtN(cx) + '" cy="' + fmtN(cy) + '" r="' + fmtN(p.r) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + fmtN(sw) + '"/>');
        return;
      }
      if (facing) {
        var pts = p.pts.map(function (q) { var c = to3(p.axis, p.pos, q[0], q[1]); return [X(c), Y(c)]; });
        out.push('<polygon points="' + pts.map(function (q) { return fmtN(q[0]) + ',' + fmtN(q[1]); }).join(' ') +
          '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + fmtN(sw) + '" stroke-linejoin="round"/>');
        rx0 = Math.min.apply(null, pts.map(function (q) { return q[0]; })); rx1 = Math.max.apply(null, pts.map(function (q) { return q[0]; }));
        ry0 = Math.min.apply(null, pts.map(function (q) { return q[1]; })); ry1 = Math.max.apply(null, pts.map(function (q) { return q[1]; }));
      } else {
        rx0 = Math.min(X(it.b.mn), X(it.b.mx)); rx1 = Math.max(X(it.b.mn), X(it.b.mx));
        ry0 = Math.min(Y(it.b.mn), Y(it.b.mx)); ry1 = Math.max(Y(it.b.mn), Y(it.b.mx));
        out.push('<rect x="' + fmtN(rx0) + '" y="' + fmtN(ry0) + '" width="' + fmtN(Math.max(rx1 - rx0, 0.1)) + '" height="' + fmtN(Math.max(ry1 - ry0, 0.1)) +
          '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + fmtN(sw) + '"/>');
      }
      // size on the face (panels, not hardware), only where it fits
      if (facing && !hw && p.cut !== false) {
        var w = rx1 - rx0, h = ry1 - ry0;
        var txt = ctx.show(w) + ' × ' + ctx.show(h);
        var f = Math.min(fs * 0.85, h * 0.32, w / (txt.length * 0.56));
        if (f >= fs * 0.38) {
          out.push('<text x="' + fmtN((rx0 + rx1) / 2) + '" y="' + fmtN((ry0 + ry1) / 2) + '" font-size="' + fmtN(f) +
            '" text-anchor="middle" dominant-baseline="central" fill="#5a544b">' + ctx.esc(txt) + '</text>');
        }
      }
    });
    // overall dimension lines: width below, height on the left
    var dimC = '#b4532a', g = fs * 1.6, tk = fs * 0.5;
    function hdim(x0, x1, y, label) {
      return '<g stroke="' + dimC + '" stroke-width="' + fmtN(sw) + '">' +
        '<line x1="' + fmtN(x0) + '" y1="' + fmtN(y) + '" x2="' + fmtN(x1) + '" y2="' + fmtN(y) + '"/>' +
        '<line x1="' + fmtN(x0) + '" y1="' + fmtN(y - tk) + '" x2="' + fmtN(x0) + '" y2="' + fmtN(y + tk) + '"/>' +
        '<line x1="' + fmtN(x1) + '" y1="' + fmtN(y - tk) + '" x2="' + fmtN(x1) + '" y2="' + fmtN(y + tk) + '"/></g>' +
        '<text x="' + fmtN((x0 + x1) / 2) + '" y="' + fmtN(y + fs * 1.15) + '" font-size="' + fmtN(fs) + '" text-anchor="middle" fill="' + dimC + '">' + label + '</text>';
    }
    function vdim(y0, y1, x, label) {
      var cy = (y0 + y1) / 2;
      var lines = '<g stroke="' + dimC + '" stroke-width="' + fmtN(sw) + '">' +
        '<line x1="' + fmtN(x) + '" y1="' + fmtN(y0) + '" x2="' + fmtN(x) + '" y2="' + fmtN(y1) + '"/>' +
        '<line x1="' + fmtN(x - tk) + '" y1="' + fmtN(y0) + '" x2="' + fmtN(x + tk) + '" y2="' + fmtN(y0) + '"/>' +
        '<line x1="' + fmtN(x - tk) + '" y1="' + fmtN(y1) + '" x2="' + fmtN(x + tk) + '" y2="' + fmtN(y1) + '"/></g>';
      // too short for the number along the line: write it upright beside the line
      if (Math.abs(y1 - y0) < String(label).length * fs * 0.6 + fs * 0.5) {
        return lines + '<text x="' + fmtN(x - fs * 0.35) + '" y="' + fmtN(cy) + '" font-size="' + fmtN(fs) +
          '" text-anchor="end" dominant-baseline="central" fill="' + dimC + '">' + label + '</text>';
      }
      return lines + '<text x="' + fmtN(x - fs * 0.5) + '" y="' + fmtN(cy) + '" font-size="' + fmtN(fs) + '" text-anchor="middle" fill="' + dimC +
        '" transform="rotate(-90 ' + fmtN(x - fs * 0.5) + ' ' + fmtN(cy) + ')">' + label + '</text>';
    }
    out.push(hdim(X0, X1, Y1 + g, ctx.show(W)));
    // heights: with a toe kick / legs, a chain (kick + carcass) next to the drawing and the
    // overall height further out; without, just the overall height
    var kick = opts && opts.kick > 0 && V.v === 'z' ? opts.kick : 0, extra = 0;
    var bed = opts && opts.bed && V.v === 'z' ? opts.bed : null;
    if (bed) {
      // a bed: floor clearance + side rail (chain), the frame, with the mattress, then the overall
      var top = opts.inside && bed.style !== 'japanese' ? bed.support : bed.top;
      var cols = [[[0, bed.clear], [bed.clear, top]], [[0, bed.top]]];
      if (opts.mattress) { cols.push([[0, bed.height]]); }
      var same = false;
      cols.forEach(function (col, i) {
        col.forEach(function (sp) {
          if (sp[1] - sp[0] < 0.5) { return; }
          if (Math.abs(-sp[0] - Y1) < 0.5 && Math.abs(-sp[1] - Y0) < 0.5) { same = true; }
          out.push(vdim(-sp[1], -sp[0], X0 - g * (1 + i * 1.8), ctx.show(sp[1] - sp[0])));
        });
      });
      if (!same) { out.push(vdim(Y0, Y1, X0 - g * (1 + cols.length * 1.8), ctx.show(H))); cols.push(0); }
      extra = g * 1.8 * (cols.length - 1);
    } else if (kick && opts.height > kick && opts.height <= -Y0 + 0.5) {
      out.push(vdim(-kick, -0, X0 - g, ctx.show(kick)));
      out.push(vdim(-opts.height, -kick, X0 - g, ctx.show(opts.height - kick)));
      if (-Y0 > opts.height + 0.5) { out.push(vdim(Y0, -opts.height, X0 - g, ctx.show(-Y0 - opts.height))); }
      out.push(vdim(Y0, Y1, X0 - g * 2.8, ctx.show(H)));
      extra = g * 1.8;
    } else {
      out.push(vdim(Y0, Y1, X0 - g, ctx.show(H)));
    }
    var vb = [X0 - m - extra, Y0 - fs, W + m + extra + fs, H + m + fs].map(fmtN).join(' ');
    return '<svg viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">' +
      out.join('') + '</svg>';
  }

  var CSS = [
    '@page{size:letter portrait;margin:10mm}',
    '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
    'body{margin:0;font:9pt/1.35 Helvetica,Arial,sans-serif;color:#24221f;background:#ece9e3}',
    '.page{width:195.9mm;height:259.4mm;margin:8mm auto;background:#fff;padding:0;position:relative;overflow:hidden;page-break-after:always;break-after:page}',
    '@media print{body{background:#fff}.page{margin:0;box-shadow:none}.np{display:none}}',
    '@media screen{.page{box-shadow:0 1px 6px rgba(0,0,0,.15);padding:6mm;width:207.9mm;height:271.4mm}}',
    '.brand{font-weight:800;letter-spacing:.5px}.brand span{font-weight:400}',
    '.hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1.5pt solid #b4532a;padding-bottom:2.5mm;margin-bottom:3mm}',
    '.hd h1{font-size:15pt;margin:0}.hd h1 b{color:#b4532a;margin-right:2mm}.hd .sub{color:#6c665c;margin-top:.8mm}',
    '.facts{display:grid;grid-template-columns:auto auto;gap:.6mm 4mm;font-size:8.5pt;text-align:right}.facts span{color:#6c665c}',
    '.views{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:58mm 58mm;gap:2.5mm}',
    '.v{border:.4pt solid #ddd7cc;border-radius:1.5mm;padding:1mm 1.5mm 1.5mm;display:flex;flex-direction:column;min-height:0}',
    '.v h3{margin:0 0 .5mm;font-size:7.5pt;text-transform:uppercase;letter-spacing:.4px;color:#6c665c}',
    '.v svg{flex:1;min-height:0;width:100%}',
    '.three{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm;margin-top:2.5mm;height:64mm}',
    '.three .v img{flex:1;min-height:0;width:100%;object-fit:contain}',
    '.hw{margin-top:2.5mm;columns:2;column-gap:6mm;font-size:7.6pt}.hw div{break-inside:avoid;padding:.3mm 0;border-bottom:.3pt dotted #ddd7cc}.hw b{display:inline-block;min-width:7mm}',
    '.warn{color:#b4532a;font-size:7.6pt;margin-top:1.5mm}',
    '.foot{position:absolute;left:6mm;right:6mm;bottom:4mm;display:flex;justify-content:space-between;font-size:7pt;color:#8a8478}',
    '@media print{.foot{left:0;right:0;bottom:0}}',
    '.room-plan{height:150mm}.room-3d{height:70mm;margin-top:2.5mm}.room-3d img{flex:1;min-height:0;width:100%;object-fit:contain}.room-wall{height:150mm}',
    '.qx{color:#b4532a;margin-left:2mm;font-size:13pt}',
    '.cover{display:flex;flex-direction:column}.cover h1{font-size:28pt;margin:40mm 0 2mm}.cover .proj{font-size:16pt;color:#b4532a;margin-bottom:10mm}',
    'table{border-collapse:collapse;width:100%;font-size:8.5pt}th,td{text-align:left;padding:1.2mm 1.5mm;border-bottom:.4pt solid #e3dfd6}th{color:#6c665c;font-weight:600;font-size:7.5pt;text-transform:uppercase}',
    'td.n,th.n{text-align:right}',
    'h2{font-size:12pt;margin:5mm 0 2mm;color:#24221f}',
    '.bar{display:flex;height:5mm;border:.4pt solid #8a8478;margin:1mm 0 .5mm;font-size:6.5pt}.bar i{display:flex;align-items:center;justify-content:center;border-right:.4pt solid #fff;background:#c8ccd0;font-style:normal;overflow:hidden;white-space:nowrap}.bar i.off{background:repeating-linear-gradient(45deg,#fff,#fff 1mm,#eee 1mm,#eee 2mm);color:#8a8478}',
    // materials: a summary page + a full-page swatch per material (the texture, the brand over it,
    // the material's name in a display serif under the brand, then what it is used for)
    '.mats-grid{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:2mm}',
    '.mcard{display:flex;gap:3mm;border:.4pt solid #ddd7cc;border-radius:2mm;padding:2.5mm;break-inside:avoid}',
    '.mcard .sw{flex:none;width:24mm;height:24mm;border-radius:1.5mm;background:#ddd center/cover no-repeat;border:.4pt solid rgba(0,0,0,.12)}',
    '.mcard small{display:block;color:#8a8478;font-weight:700;letter-spacing:.8px;font-size:7pt}.mcard b{display:block;font-size:10pt;margin:.3mm 0 1mm}.mcard span{display:block;font-size:7.6pt;color:#6c665c}',
    '.mat-page{padding:0!important}',
    '.mat-hero{position:absolute;left:0;right:0;top:0;height:205mm;background:#d8d2c4 center/cover no-repeat;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:0 14mm 22mm;text-align:center}',
    // wood grain runs along the image's width: turned upright on the portrait page
    '.mat-tex{position:absolute;left:50%;top:50%;width:232mm;height:232mm;transform:translate(-50%,-50%);background:center/cover no-repeat}',
    '.mat-tex.rot{transform:translate(-50%,-50%) rotate(90deg)}',
    '.mat-hero{overflow:hidden}.mat-hero>*:not(.mat-tex){position:relative}',
    '.mat-hero.dark{color:#fff}.mat-hero:not(.dark){color:#1d2620}',
    '.mat-brand{font:900 26pt/1 "Arial Black","Helvetica Neue",Helvetica,Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase}',
    '.mat-brand img{max-height:22mm;max-width:110mm;display:block;margin:0 auto}',
    '.mat-rule{display:flex;align-items:center;gap:2.5mm;width:82mm;margin:5mm auto 4mm;opacity:.75}.mat-rule i{flex:1;height:.4pt;background:currentColor}.mat-rule b{width:2.2mm;height:2.2mm;transform:rotate(45deg);background:currentColor}',
    '.mat-name{font:400 34pt/1.05 Didot,"Bodoni 72","Bodoni MT","Playfair Display",Garamond,Georgia,"Times New Roman",serif;letter-spacing:1px}',
    '.mat-hero:not(.dark) .mat-name{color:#3a2a18}',
    '.mat-type{margin-top:5mm;font:600 8.5pt/1 Helvetica,Arial,sans-serif;letter-spacing:4px;text-transform:uppercase}',
    '.mat-hero.dark .mat-brand,.mat-hero.dark .mat-name,.mat-hero.dark .mat-type{text-shadow:0 1px 6px rgba(0,0,0,.45)}',
    '.mat-hero:not(.dark) .mat-brand,.mat-hero:not(.dark) .mat-name{text-shadow:0 0 10px rgba(255,255,255,.35)}',
    '.mat-info{position:absolute;left:12mm;right:12mm;top:213mm;display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;font-size:8pt}',
    '.mat-info span{display:block;color:#8a8478;font-size:6.8pt;text-transform:uppercase;letter-spacing:.6px;margin-bottom:.6mm}.mat-info b{font-size:9.5pt}',
    '@media screen{.mat-page .foot{left:6mm;right:6mm}}',
    '.np{position:fixed;top:4mm;right:4mm;z-index:9}.np button{font:600 11pt Helvetica,Arial;padding:3mm 5mm;border-radius:2mm;border:0;background:#b4532a;color:#fff;cursor:pointer}'
  ].join('');

  // A Japanese bed's foot-left corner in plan: the notched foot ledge support (cut by hand), the
  // side support butting its ear (biscuit), the inner bands and the red skirt under the supports.
  // 38 mm Japanese bed: the ledge bands butt (foot full width), the heavy rails under them.
  function bedButtSVG(n, ctx, t) {
    var T = n.t, L = n.ledge, O = n.ear, run = L * 1.3, deep = L * 1.3, W = L + run, H = L + deep;
    var pad = Math.max(40, L * 0.4), fs = Math.max(12, L * 0.13), o = [];
    function txt(x, y, s, a) { o.push('<text x="' + fmtN(x) + '" y="' + fmtN(y) + '" font-size="' + fmtN(fs) + '" text-anchor="' + (a || 'middle') + '" fill="#1d2a30">' + s + '</text>'); }
    function line(d, dash) { o.push('<path d="' + d + '" stroke="' + (dash ? '#c0392b' : '#1d2a30') + '" stroke-width="' + fmtN(fs * 0.1) + '" fill="none"' + (dash ? ' stroke-dasharray="' + fmtN(fs * 0.5) + ' ' + fmtN(fs * 0.3) + '"' : '') + '/>'); }
    o.push('<rect x="0" y="0" width="' + fmtN(W) + '" height="' + fmtN(L) + '" fill="#e6c9ef" stroke="#3b3b3b" stroke-width="' + fmtN(fs * 0.12) + '"/>');
    o.push('<rect x="0" y="' + fmtN(L) + '" width="' + fmtN(L) + '" height="' + fmtN(deep) + '" fill="#efd9f4" stroke="#3b3b3b" stroke-width="' + fmtN(fs * 0.12) + '"/>');
    line('M' + fmtN(O) + ' ' + fmtN(H) + 'V' + fmtN(O) + 'H' + fmtN(W) + 'M' + fmtN(L) + ' ' + fmtN(H) + 'V' + fmtN(L) + 'H' + fmtN(W), true);
    txt(L + run / 2, L / 2, t('Foot ledge band'));
    txt(L / 2, L + deep / 2, t('Side ledge band'));
    line('M' + fmtN(-fs * 0.6) + ' 0V' + fmtN(L)); txt(-fs, L / 2, ctx.show(L), 'end');
    line('M0 ' + fmtN(-fs * 0.8) + 'H' + fmtN(O)); txt(O / 2, -fs * 1.1, t('overhang') + ' ' + ctx.show(O));
    line('M' + fmtN(O) + ' ' + fmtN(H + fs * 0.6) + 'H' + fmtN(L)); txt((O + L) / 2, H + fs * 1.8, ctx.show(T));
    return '<svg viewBox="' + fmtN(-pad * 1.6) + ' ' + fmtN(-pad) + ' ' + fmtN(W + pad * 3) + ' ' + fmtN(H + pad * 1.8) + '" style="width:100%;max-height:230px" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }
  function bedNotchSVG(n, ctx, t) {
    if (n.kind === 'butt') { return bedButtSVG(n, ctx, t); }
    var T = n.t, L = n.ledge, E = n.ear, run = Math.min(n.mid / 2, L * 0.9), deep = L * 0.95;
    var W = E + T + run, H = L + deep, pad = Math.max(40, L * 0.4), fs = Math.max(12, L * 0.13);
    var Y = function (y) { return y; };   // y down = towards the head
    var o = [];
    function rect(x0, y0, x1, y1, fill) { o.push('<rect x="' + fmtN(x0) + '" y="' + fmtN(Y(y0)) + '" width="' + fmtN(x1 - x0) + '" height="' + fmtN(y1 - y0) + '" fill="' + fill + '" stroke="#3b3b3b" stroke-width="' + fmtN(fs * 0.12) + '"/>'); }
    function txt(x, y, s, anchor) { o.push('<text x="' + fmtN(x) + '" y="' + fmtN(y) + '" font-size="' + fmtN(fs) + '" text-anchor="' + (anchor || 'middle') + '" fill="#1d2a30">' + s + '</text>'); }
    function dimH(x0, x1, y, s) { o.push('<path d="M' + fmtN(x0) + ' ' + fmtN(y) + 'H' + fmtN(x1) + 'M' + fmtN(x0) + ' ' + fmtN(y - fs * 0.4) + 'v' + fmtN(fs * 0.8) + 'M' + fmtN(x1) + ' ' + fmtN(y - fs * 0.4) + 'v' + fmtN(fs * 0.8) + '" stroke="#1d2a30" stroke-width="' + fmtN(fs * 0.08) + '" fill="none"/>'); txt((x0 + x1) / 2, y - fs * 0.35, s); }
    function dimV(y0, y1, x, s) { o.push('<path d="M' + fmtN(x) + ' ' + fmtN(y0) + 'V' + fmtN(y1) + 'M' + fmtN(x - fs * 0.4) + ' ' + fmtN(y0) + 'h' + fmtN(fs * 0.8) + 'M' + fmtN(x - fs * 0.4) + ' ' + fmtN(y1) + 'h' + fmtN(fs * 0.8) + '" stroke="#1d2a30" stroke-width="' + fmtN(fs * 0.08) + '" fill="none"/>'); txt(x - fs * 0.4, (y0 + y1) / 2 + fs * 0.35, s, 'end'); }
    // red skirt (under the supports), dashed
    o.push('<path d="M' + fmtN(E - T) + ' ' + fmtN(H) + 'V' + fmtN(L - 2 * T) + 'H' + fmtN(W) + 'M' + fmtN(E) + ' ' + fmtN(H) + 'V' + fmtN(L - T) + 'H' + fmtN(W) + '" stroke="#c0392b" stroke-dasharray="' + fmtN(fs * 0.5) + ' ' + fmtN(fs * 0.3) + '" stroke-width="' + fmtN(fs * 0.1) + '" fill="none"/>');
    // inner bands
    rect(E, L - T, W, L, '#f2e7a6');
    rect(E, L, E + T, H, '#f2e7a6');
    // supports: the foot one with its notch, the side one butting the ear
    o.push('<polygon points="0,0 ' + fmtN(W) + ',0 ' + fmtN(W) + ',' + fmtN(L - T) + ' ' + fmtN(E) + ',' + fmtN(L - T) + ' ' + fmtN(E) + ',' + fmtN(L) + ' 0,' + fmtN(L) + '" fill="#e6c9ef" stroke="#3b3b3b" stroke-width="' + fmtN(fs * 0.12) + '"/>');
    rect(0, L, E, H, '#efd9f4');
    // biscuit
    o.push('<ellipse cx="' + fmtN(E / 2) + '" cy="' + fmtN(L) + '" rx="' + fmtN(Math.min(E * 0.3, 28)) + '" ry="' + fmtN(fs * 0.35) + '" fill="#b88a4a"/>');
    txt(E / 2, L + fs * 1.6, t('biscuit'));
    txt(W - run / 2, (L - T) / 2 + fs * 0.35, t('Foot ledge support'));
    txt(E / 2, L + deep / 2, t('Side support'));
    // dimensions
    dimV(0, L, -fs * 0.6, ctx.show(L));
    dimH(0, E, -fs * 0.9, ctx.show(E));
    dimV(L - T, L, W + fs * 2.6, ctx.show(T));
    dimH(E, W, L + fs * 3.4, t('notch') + ' ' + ctx.show(T) + ' × ' + ctx.show(n.mid));
    dimH(0, E, H - fs, ctx.show(E));
    return '<svg viewBox="' + fmtN(-pad * 1.6) + ' ' + fmtN(-pad) + ' ' + fmtN(W + pad * 3) + ' ' + fmtN(H + pad * 1.4) + '" style="width:100%;max-height:230px" xmlns="http://www.w3.org/2000/svg">' + o.join('') + '</svg>';
  }

  function build(d, ctx) {
    var t = ctx.t, esc = ctx.esc, u = ' ' + ctx.units;
    var mods = d.modules || [], nAll = d.count || mods.reduce(function (a, m) { return a + (m.qty || 1); }, 0);
    function qx(m) { return (m.qty || 1) > 1 ? ' <span class="qx">× ' + m.qty + '</span>' : ''; }
    function qcodes(m) { return (m.qty || 1) > 1 && m.codes ? ' <small style="color:#6c665c">(' + m.codes.map(esc).join(', ') + ')</small>' : ''; }
    // installer pages (a project placed in a room, from SketchUp): the plan + one elevation per wall
    // from the plugin: the placed modules (items) point at their code's page for the parts
    if (d.room && d.room.items && !d.room.mods) {
      var byCode = {}, RR = d.room;
      mods.forEach(function (m) { byCode[m.code] = m; });
      RR.mods = {}; RR.snap = { parts: [], movers: [], places: {} };
      RR.items.forEach(function (it) {
        var m = byCode[it.group] || byCode[it.code];
        if (!m || !m.parts) { return; }
        var pre = it.id + ':';
        RR.mods[it.id] = { parts: m.parts, bb: m.bbox, code: it.code };
        RR.snap.places[it.id] = { x: it.room.x, y: it.room.y, z: it.room.z, rz: it.room.rot };
        m.parts.forEach(function (q) { var c = Object.assign({}, q, { grp: it.id }); if (q.mover) { c.mover = pre + q.mover; } RR.snap.parts.push(c); });
        (m.movers || []).forEach(function (mv) { RR.snap.movers.push(Object.assign({}, mv, { id: pre + mv.id, grp: it.id })); });
      });
    }
    // ---- materials used: from the cut panels of these modules (× their quantity)
    var ROLE = { carcass: 'Carcass', front: 'Fronts', back: 'Back', shelf: 'Shelves', drawer: 'Drawer boxes', skin: 'Decorative panels',
                 base: 'Toe kick', frame: 'Face frame', top: 'Decorative top', inner: 'Inner drawers', bed: 'Bed frame' };
    var MATS = [], byMat = {};
    mods.forEach(function (m) {
      (m.parts || []).forEach(function (q) {
        if (q.cut === false || !q.mat || q.deco) { return; }
        var e = byMat[q.mat];
        if (!e) { e = byMat[q.mat] = { name: q.mat, pieces: 0, area: 0, th: {}, roles: [], mods: [] }; MATS.push(e); }
        var n = m.qty || 1;
        e.pieces += n;
        e.area += (Number(q.L) || 0) * (Number(q.W) || 0) * n / 1e6;
        if (q.T) { e.th[ctx.show(q.T)] = 1; }
        var r = ROLE[q.role] || null;
        if (r && e.roles.indexOf(r) < 0) { e.roles.push(r); }
        if (m.code && e.mods.indexOf(m.code) < 0) { e.mods.push(m.code); }
      });
    });
    MATS.sort(function (a, b) { return b.area - a.area; });
    var MD = d.materials || {};
    function matMeta(e) {
      var x = MD[e.name] || {}, inf = ctx.mats ? ctx.mats(e.name) : null;
      var brand = String(x.brand || '').trim(), name = String(x.label || e.name);
      if (brand && name.toUpperCase().indexOf(brand.toUpperCase() + ' ') === 0) { name = name.slice(brand.length + 1); }
      name = name.replace(/^PanelPro /, '');
      var color = x.color || (inf && (inf.avg || inf.color)) || '#d8d2c4';
      return { brand: brand, name: name, type: x.type || '', image: x.image || (inf && inf.thumb) || '', logo: x.logo || '', color: color, rot: !!x.rot,
               sheet: x.sheet || '', code: x.code || '' };
    }
    function dark(c) {
      var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(String(c)), r, g, b;
      if (m) { r = parseInt(m[1], 16); g = parseInt(m[2], 16); b = parseInt(m[3], 16); }
      else if ((m = /rgb\((\d+),\s*(\d+),\s*(\d+)/.exec(String(c)))) { r = +m[1]; g = +m[2]; b = +m[3]; }
      else { return false; }
      return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
    }
    var TYPE = { melamine: 'Melamine', mdf: 'MDF', plywood: 'Plywood' };
    var matPages = MATS.length ? 1 + MATS.length : 0;
    var R = d.room && d.room.layout && d.room.layout.walls && d.room.layout.walls.length && window.PPRoom ? d.room : null;
    var roomPages = R ? 1 + R.layout.walls.length : 0;
    var pageNo = 0, total = 1 + matPages + roomPages + mods.length + 1;
    function foot() {
      pageNo += 1;
      return '<div class="foot"><span class="brand">CSPARTNERS <span>PANEL PRO</span></span><span>' + esc(d.title || '') + ' · ' + esc(d.date) +
        '</span><span>' + t('Page') + ' ' + pageNo + ' / ' + total + '</span></div>';
    }
    var h = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc((d.title || 'PanelPro') + ' — ' + t('Module manual')) + '</title><style>' + CSS + '</style></head><body>';
    h += '<div class="np"><button onclick="window.print()">' + esc(t('Print / save PDF…')) + '</button></div>';

    // ---- cover
    h += '<section class="page cover"><div class="brand" style="font-size:12pt">CSPARTNERS <span>PANEL PRO</span></div>' +
      '<h1>' + esc(t('Module manual')) + '</h1><div class="proj">' + esc(d.title || t('Untitled project')) + '</div>' +
      '<div class="facts" style="text-align:left;grid-template-columns:auto 1fr;margin-bottom:8mm"><span>' + t('Date') + '</span><b>' + esc(d.date) + '</b>' +
      '<span>' + t('Modules') + '</span><b>' + nAll + (nAll !== mods.length ? ' (' + mods.length + ' ' + t('different') + ')' : '') + '</b><span>' + t('Scope') + '</span><b>' + esc(d.scope === 'all' ? t('All modules') : t('Selected modules')) + '</b></div>' +
      '<table><tr><th>' + t('Code') + '</th><th class="n">' + t('Qty') + '</th><th>' + t('Module') + '</th><th>' + t('Type') + '</th><th class="n">' + t('Size') + ' (W × H × D)</th><th class="n">' + t('Page') + '</th></tr>';
    mods.forEach(function (m, i) {
      h += '<tr><td><b>' + esc(m.code || '') + '</b></td><td class="n">' + (m.qty || 1) + '</td><td>' + esc(m.name || '') + qcodes(m) + '</td><td>' + esc(m.label ? t(m.label) : '') +
        '</td><td class="n">' + (m.error ? '—' : ctx.show(m.width) + ' × ' + ctx.show(m.height) + ' × ' + ctx.show(m.depth) + u) + '</td><td class="n">' + (i + 2 + matPages + roomPages) + '</td></tr>';
    });
    h += '</table>' + foot() + '</section>';

    // ---- materials: the list, then one page per material
    if (MATS.length) {
      h += '<section class="page"><div class="hd"><div><h1>' + esc(t('Materials')) + '</h1><div class="sub">' + esc(d.title || '') + ' · ' + MATS.length + ' ' +
        esc(t(MATS.length === 1 ? 'material' : 'materials')) + '</div></div></div><div class="mats-grid">' + MATS.map(function (e) {
          var mm = matMeta(e);
          return '<div class="mcard"><div class="sw" style="background-color:' + esc(mm.color) + (mm.image ? ';background-image:url(\'' + esc(mm.image) + '\')' : '') + '"></div><div>' +
            (mm.brand ? '<small>' + esc(mm.brand) + '</small>' : '') + '<b>' + esc(mm.name) + '</b>' +
            '<span>' + esc(e.roles.map(t).join(', ')) + '</span><span>' + Object.keys(e.th).join(' / ') + u + ' · ' + e.pieces + ' ' + t('pieces') + ' · ' + (Math.round(e.area * 100) / 100) + ' m²</span></div></div>';
        }).join('') + '</div>' + foot() + '</section>';
      MATS.forEach(function (e) {
        var mm = matMeta(e), dk = dark(mm.color);
        var typ = mm.type ? t('%s collection').replace('%s', t(TYPE[mm.type] || mm.type)) : t('Board collection');
        h += '<section class="page mat-page"><div class="mat-hero' + (dk ? ' dark' : '') + '" style="background-color:' + esc(mm.color) + '">' +
          (mm.image ? '<div class="mat-tex' + (mm.rot ? ' rot' : '') + '" style="background-image:url(\'' + esc(mm.image) + '\')"></div>' : '') +
          (mm.logo ? '<div class="mat-brand"><img alt="' + esc(mm.brand) + '" src="' + esc(mm.logo) + '"></div>' : mm.brand ? '<div class="mat-brand">' + esc(mm.brand) + '</div>' : '') +
          '<div class="mat-rule"><i></i><b></b><i></i></div>' +
          '<div class="mat-name">' + esc(mm.name) + '</div>' +
          '<div class="mat-type">' + esc(typ) + '</div></div>' +
          '<div class="mat-info"><div><span>' + esc(t('Used for')) + '</span><b>' + esc(e.roles.map(t).join(', ') || '—') + '</b></div>' +
          '<div><span>' + esc(t('Thickness')) + '</span><b>' + Object.keys(e.th).join(' / ') + u + '</b></div>' +
          '<div><span>' + esc(t('Pieces')) + '</span><b>' + e.pieces + ' · ' + (Math.round(e.area * 100) / 100) + ' m²</b></div>' +
          '<div><span>' + esc(t('Modules')) + '</span><b>' + esc(e.mods.join(' · ') || '—') + '</b></div></div>' +
          foot() + '</section>';
      });
    }

    // ---- installation: where everything goes
    if (R) {
      var L = R.layout, rctx = { t: t, show: ctx.show };
      var snap = R.snap && window.P3D && window.P3D.snapshot ? window.P3D.snapshot(R.snap.parts, ctx.mats, R.snap.movers, { open: false, w: 1000, h: 620, places: R.snap.places }) : null;
      h += '<section class="page"><div class="hd"><div><h1>' + esc(t('Room plan')) + '</h1><div class="sub">' + esc(t('Installation')) + ' · ' +
        L.walls.length + ' ' + esc(t(L.walls.length === 1 ? 'wall' : 'walls')) + ' · ' + nAll + ' ' + t('modules') + '</div></div></div>' +
        '<div class="v room-plan"><h3>' + esc(t('Plan from above')) + '</h3>' + window.PPRoom.planSvg(L, rctx) + '</div>' +
        (snap ? '<div class="v room-3d"><h3>3D</h3><img src="' + snap + '"></div>' : '') +
        '<div class="hw">' + L.walls.map(function (w) {
          return '<div><b>' + esc(w.name) + '</b> ' + w.mods.map(function (x) { return esc(x.code || ''); }).join(' · ') + ' — ' + ctx.show(w.length) + u + '</div>';
        }).join('') + '</div>' + foot() + '</section>';
      L.walls.forEach(function (w) {
        var low = w.mods.filter(function (x) { return x.z < 900; }), high = w.mods.filter(function (x) { return x.z >= 900; });
        var list = function (a) { return a.map(function (x) { return esc(x.code || ''); }).join(' · '); };
        h += '<section class="page"><div class="hd"><div><h1><b>' + esc(w.name) + '</b>' + esc(t('Elevation')) + '</h1><div class="sub">' +
          esc(t('Seen from the front, left to right')) + ' · ' + ctx.show(w.length) + u + '</div></div>' +
          '<div class="facts">' + (low.length ? '<span>' + t('Floor') + '</span><b>' + list(low) + '</b>' : '') +
          (high.length ? '<span>' + t('Wall cabinets') + '</span><b>' + list(high) + '</b>' : '') + '</div></div>' +
          '<div class="v room-wall"><h3>' + esc(t('Elevation')) + '</h3>' + window.PPRoom.wallSvg(w, R.mods, rctx) + '</div>' +
          '<table style="margin-top:3mm"><tr><th>' + t('Code') + '</th><th class="n">' + t('From the left') + '</th><th class="n">' + t('Off the floor') + '</th><th class="n">' + t('Width') + '</th></tr>' +
          w.mods.slice().sort(function (a, b) { return a.x0 - b.x0 || a.z - b.z; }).map(function (x) {
            return '<tr><td><b>' + esc(x.code || '') + '</b></td><td class="n">' + ctx.show(x.x0) + u + '</td><td class="n">' + ctx.show(x.z) + u + '</td><td class="n">' + ctx.show(x.x1 - x.x0) + u + '</td></tr>';
          }).join('') + '</table>' + foot() + '</section>';
      });
    }

    // ---- one page per module
    mods.forEach(function (m) {
      h += '<section class="page">';
      h += '<div class="hd"><div><h1><b>' + esc(m.code || '') + '</b>' + esc(m.name || '') + qx(m) + '</h1><div class="sub">' + esc(m.label ? t(m.label) : '') +
        (m.error ? '' : ' · ' + ctx.show(m.width) + ' × ' + ctx.show(m.height) + ' × ' + ctx.show(m.depth) + u + ' · ' + t('panels') + ' ' + ctx.show(m.t) + u) + '</div></div>';
      if (m.error) {
        h += '</div><p class="warn">' + esc(m.error) + '</p>' + foot() + '</section>';
        return;
      }
      var c = m.counts || {}, sl = Object.keys(c.slides || {}).map(function (nl) { return c.slides[nl] + ' × ' + ctx.show(+nl) + u; });
      h += '<div class="facts">' +
        '<span>' + t('Doors') + '</span><b>' + (c.doors || 0) + '</b>' +
        '<span>' + t('Drawers') + '</span><b>' + (c.drawers || 0) + '</b>' +
        '<span>' + t('Hinges') + '</span><b>' + (c.hinges || 0) + '</b>' +
        '<span>' + t('Slides (pairs)') + '</span><b>' + (sl.length ? esc(sl.join(', ')) : '0') + '</b>' +
        (c.legs ? '<span>' + t('Legs') + '</span><b>' + c.legs + '</b>' : '') +
        '<span>' + t('Carcass') + '</span><b>' + esc(m.mat_carcass || '') + '</b>' +
        '<span>' + t('Fronts') + '</span><b>' + esc(m.mat_front || '') + '</b></div></div>';
      var all = m.parts || [];
      var hv = { kick: m.kick || 0, height: m.height, bed: m.bed || null, mattress: (m.parts || []).some(function (p) { return p.name === 'Mattress'; }) };
      var hvIn = Object.assign({}, hv, { inside: true });
      var inside = all.filter(function (p) { return !p.mover && p.role !== 'front'; });
      h += '<div class="views">' +
        '<div class="v"><h3>' + t('Front view') + '</h3>' + viewSVG(all, 'front', ctx, hv) + '</div>' +
        '<div class="v"><h3>' + t('Front view — without doors and fronts') + '</h3>' + viewSVG(inside, 'front', ctx, hvIn) + '</div>' +
        '<div class="v"><h3>' + t('Top view') + '</h3>' + viewSVG(all, 'top', ctx) + '</div>' +
        '<div class="v"><h3>' + t('Left view') + '</h3>' + viewSVG(all, 'left', ctx, hv) + '</div>' +
        '<div class="v"><h3>' + t('Right view') + '</h3>' + viewSVG(all, 'right', ctx, hv) + '</div>' +
        '<div class="v"><h3>' + t('Back view') + '</h3>' + viewSVG(all, 'back', ctx, hv) + '</div></div>';
      // a Japanese bed: its ledge corner plan takes the place of the "open" picture (nothing opens)
      var bedNotchBox = function (nb) {
        if (nb.kind === 'butt') {
          return '<div class="v"><h3>' + t('Ledge corner — plan (foot, left; the right one mirrored)') + '</h3>' + bedNotchSVG(nb, ctx, t) +
            '<p class="sub">' + esc(t('Ledge bands butt at the corner (screws): the foot one full width, the side ones against it.')) + '</p></div>';
        }
        return '<div class="v"><h3>' + t('Ledge corner — plan (foot, left; the right one mirrored)') + '</h3>' + bedNotchSVG(nb, ctx, t) +
          '<p class="sub">' + esc(t('Cut the foot ledge support as a plain board; the installer cuts the notch by hand:') + ' ' + ctx.show(nb.t) + ' × ' + ctx.show(nb.mid) + u + ', ' +
          t('ears') + ' ' + ctx.show(nb.ear) + u + '. ' + t('Side supports') + ' ' + ctx.show(nb.side) + u + ' ' + t('wide, butting the ears with a biscuit.')) + '</p></div>';
      };
      // a bed (nothing opens): a section across the middle, with its heights
      var bedSectionBox = function () {
        var ym = (m.depth || 0) / 2;
        var cut = all.filter(function (p) { var b = box(p); return b.mn[1] <= ym && b.mx[1] >= ym; });
        return '<div class="v"><h3>' + t('Section across the middle') + '</h3>' + viewSVG(cut, 'front', ctx, hv) + '</div>';
      };
      var closed = window.P3D && window.P3D.snapshot ? window.P3D.snapshot(all, ctx.mats, m.movers, { open: false, w: 900, h: 640 }) : null;
      var open = window.P3D && window.P3D.snapshot && (m.movers || []).length ? window.P3D.snapshot(all, ctx.mats, m.movers, { open: true, w: 900, h: 640 }) : null;
      h += '<div class="three"><div class="v"><h3>' + t('3D — closed') + '</h3>' + (closed ? '<img src="' + closed + '">' : '') + '</div>' +
        (m.bed && m.bed.notch ? bedNotchBox(m.bed.notch) : m.bed ? bedSectionBox() :
        '<div class="v"><h3>' + t('3D — open') + '</h3>' + (open ? '<img src="' + open + '">' : '<p class="sub">' + t('No doors or drawers') + '</p>') + '</div>') + '</div>';
      if ((m.qty || 1) > 1) { h += '<div class="warn" style="color:#6c665c">' + esc(t('Hardware for one module — build') + ' ' + m.qty + '.') + '</div>'; }
      h += '<div class="hw">' + (m.hardware_l || []).map(function (x) { return '<div><b>' + x[1] + '×</b> ' + esc(x[0]) + '</div>'; }).join('') + '</div>';
      if ((m.warnings || []).length) { h += '<div class="warn">⚠ ' + m.warnings.map(esc).join(' · ') + '</div>'; }
      h += foot() + '</section>';
    });

    // ---- project parts
    h += '<section class="page"><div class="hd"><div><h1>' + t('Project parts') + '</h1><div class="sub">' + esc(d.title || '') + ' · ' + nAll + ' ' + t('modules') + '</div></div></div>';
    h += '<h2>' + t('Hardware totals') + '</h2><table><tr><th class="n">' + t('Qty') + '</th><th>' + t('Item') + '</th></tr>';
    (d.totals || []).forEach(function (x) { h += '<tr><td class="n"><b>' + x[1] + '</b></td><td>' + esc(x[0]) + '</td></tr>'; });
    h += '</table>';
    (d.kick || []).forEach(function (k) {
      var nb = k.bars.length;
      h += '<h2>' + t('Plastic toe kick') + ' ' + ctx.show(k.h) + u + ' — ' + nb + ' ' + (nb === 1 ? t('bar') : t('bars')) + ' × ' + ctx.show(d.bar) + u + '</h2>';
      h += '<p>' + t('Total length') + ' <b>' + k.metres + ' m</b> · ' + k.pieces + ' ' + t('pieces') + ' · ' + t('saw cut') + ' ' + ctx.show(d.kerf) + u + '</p>';
      k.bars.forEach(function (b, i) {
        h += '<div style="break-inside:avoid"><b>' + t('Bar') + ' ' + (i + 1) + '</b> — ' + b.cuts.map(function (c) {
          return ctx.show(c.len) + (c.code ? ' (' + esc(c.code) + (c.part ? ' ' + t('part') + ' ' + esc(c.part.replace('(joint)', t('(joint)'))) : '') + ')' : '');
        }).join(' + ') + ' · ' + t('offcut') + ' ' + ctx.show(b.offcut) + u;
        h += '<div class="bar">' + b.cuts.map(function (c) { return '<i style="width:' + (c.len / d.bar * 100) + '%">' + ctx.show(c.len) + '</i>'; }).join('') +
          (b.offcut > 0.5 ? '<i class="off" style="width:' + (b.offcut / d.bar * 100) + '%">' + ctx.show(b.offcut) + '</i>' : '') + '</div></div>';
      });
    });
    if (!(d.kick || []).length) { h += '<p class="sub">' + t('No plastic toe kick in these modules.') + '</p>'; }
    h += '<p class="sub" style="margin-top:4mm">' + t('Panels: see the cut list and the sheet optimizer report.') + '</p>';
    h += foot() + '</section></body></html>';
    return h;
  }

  // The editors' 2D view: one side (front / right / back / left / top) drawn like the manual, with
  // panel sizes and dimension lines. info: { params, bed } → { viewBox, html } (or null if nothing to draw)
  function sideView(parts, side, ctx, info) {
    var p = (info && info.params) || {};
    var opts = { kick: p.kick_type && p.kick_type !== 'none' ? Number(p.kick_h) || 0 : 0, height: Number(p.height) || 0,
                 bed: (info && info.bed) || null, mattress: (parts || []).some(function (q) { return q.name === 'Mattress'; }) };
    var svg = viewSVG(parts || [], VIEWS[side] ? side : 'front', ctx, opts);
    if (!svg) { return null; }
    var vb = /viewBox="([^"]+)"/.exec(svg);
    return { viewBox: vb ? vb[1] : '0 0 100 100', html: svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') };
  }
  window.PPManual = { build: build, viewSVG: viewSVG, sideView: sideView, SIDES: ['front', 'right', 'back', 'left', 'top'] };
})();
