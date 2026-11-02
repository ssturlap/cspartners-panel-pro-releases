/* CSPARTNERS PANEL PRO — drawings and readouts shared by the SketchUp Configurator (ui/panel.js)
 * and PanelPro Web (web/app.js): the 2D front view, the small readouts under settings (fridge
 * opening, blind corner, decorative panels, metal box, loose panel) and the sheet optimizer
 * drawings / printable cutting plan. Pure functions: everything they need comes in `ctx`
 *   ctx = { t(text), show(mm) → text in the current units, units, es, settings: { opt } }
 */
(function () {
  'use strict';
  var F = window.PPFields;
  var R = {};
  window.PPReports = R;

  // ------------------------------------------------------------------ 2D front view
  var ORDER = ['back', 'base', 'carcass', 'shelf', 'drawer', 'hardware', 'top', 'frame', 'front'];

  // Which visibility group a part belongs to: doors (incl. their hinge cups),
  // drawer fronts (incl. false fronts) or drawer boxes (incl. runners that move).
  function visGroup(p, kinds) {
    if (p.mover && kinds[p.mover]) {
      if (kinds[p.mover] === 'door') { return 'doors'; }
      return p.role === 'front' ? 'dfronts' : 'dboxes';
    }
    if (p.role === 'front' && /^False front/.test(p.name)) { return 'dfronts'; }
    return null;
  }

  R.visGroup = visGroup;
  R.ORDER = ORDER;

  function frontPoly(p) {
    if (p.shape === 'cyl') {
      if (p.axis !== 'z') { return null; }
      var c = p.center;
      return [[c[0] - p.r, c[2]], [c[0] + p.r, c[2]], [c[0] + p.r, c[2] + p.len], [c[0] - p.r, c[2] + p.len]];
    }
    var us = p.pts.map(function (q) { return q[0]; }), vs = p.pts.map(function (q) { return q[1]; });
    if (p.axis === 'y') { return p.pts; }
    if (p.axis === 'x') { return [[p.pos, Math.min.apply(0, vs)], [p.pos + p.thk, Math.min.apply(0, vs)], [p.pos + p.thk, Math.max.apply(0, vs)], [p.pos, Math.max.apply(0, vs)]]; }
    return [[Math.min.apply(0, us), p.pos], [Math.max.apply(0, us), p.pos], [Math.max.apply(0, us), p.pos + p.thk], [Math.min.apply(0, us), p.pos + p.thk]];
  }

  R.frontPoly = frontPoly;

  // parts → { viewBox, html } of the front elevation (CSS variables --carcass, --front … colour it).
  R.elevation = function (parts) {
    var polys = [];
    var minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
    parts.slice().sort(function (a, b) { return ORDER.indexOf(a.role) - ORDER.indexOf(b.role); }).forEach(function (p) {
      var g = frontPoly(p);
      if (!g) { return; }
      g.forEach(function (q) { minX = Math.min(minX, q[0]); maxX = Math.max(maxX, q[0]); minZ = Math.min(minZ, q[1]); maxZ = Math.max(maxZ, q[1]); });
      polys.push([p, g]);
    });
    var pad = Math.max(maxX - minX, maxZ - minZ) * 0.04;
    var vbW = maxX - minX + pad * 2, vbH = maxZ - minZ + pad * 2;
    var viewBox = (minX - pad) + ' 0 ' + vbW + ' ' + vbH;
    var Y = function (z) { return (maxZ + pad - z); };
    var sw = Math.max(vbW, vbH) / 400;
    var out = [];
    polys.forEach(function (pg) {
      var p = pg[0];
      var pts = pg[1].map(function (q) { return q[0].toFixed(1) + ',' + Y(q[1]).toFixed(1); }).join(' ');
      out.push('<polygon points="' + pts + '" fill="' + (p.edited ? '#ef8f3a' : 'var(--' + p.role + ')') + '" stroke="var(--stroke)" stroke-width="' + sw + '" stroke-linejoin="round"/>');
      (p.grooves || []).forEach(function (gr) {
        out.push('<line x1="' + gr[0][0] + '" y1="' + Y(gr[0][1]) + '" x2="' + gr[1][0] + '" y2="' + Y(gr[1][1]) + '" stroke="var(--stroke)" stroke-width="' + sw * 0.8 + '"/>');
      });
    });
    return { viewBox: viewBox, html: out.join('') };
  };


  // ------------------------------------------------------------------ readouts
  function u(ctx) { return ' ' + ctx.units; }
  R.info = {
    fridge: function (p, ctx) {
      if (!p.fridge) { return ''; }
      var es = ctx.es, show = ctx.show;
      var ow = p.width - 2 * p.t, oh = p.height - p.fridge_top_h;
      var fw = ow - 2 * p.fridge_gap_side, fh = oh - p.fridge_gap_top;
      return (es ? 'Hueco ' : 'Opening ') + show(ow) + ' × ' + show(oh) + u(ctx) + ' · ' +
        (es ? 'cabe una nevera de hasta ' : 'fits a fridge up to ') + show(fw) + ' × ' + show(fh) + u(ctx) +
        (p.fridge_d > p.depth ? ' · ' + (es ? 'la nevera sobresale ' : 'the fridge stands out ') + show(p.fridge_d - p.depth) + u(ctx) : '');
    },
    // Blind corner: what the blind section is made of and what's left for the door.
    corner: function (p, ctx) {
      if (!p.corner || p.corner === 'none') { return ''; }
      var es = ctx.es, show = ctx.show;
      var ft = p.front_t_same !== false ? p.t : p.front_t;
      var far = p.width - (p.reveal || 0);
      var blind, why = '';
      if (p.corner_size === 'blind') { blind = p.corner_blind_w; }
      else if (p.corner_size === 'door') { blind = far - p.corner_door_w - (p.gap || 0); }
      else {
        blind = p.corner_nb_depth + ft + p.corner_clear;
        why = ' (' + show(p.corner_nb_depth) + ' + ' + (es ? 'frente ' : 'front ') + show(ft) + ' + ' + (es ? 'holgura ' : 'clearance ') + show(p.corner_clear) + ')';
      }
      var door = far - blind - (p.gap || 0);
      return (es ? 'Panel ciego ' : 'Blind panel ') + show(blind) + u(ctx) + why + ' · ' + (es ? 'puerta ≈ ' : 'door ≈ ') + show(door) + u(ctx) +
        (p.corner_clear > 0 ? ' · ' + (es ? 'el otro módulo queda a ' : 'other module held ') + show(p.corner_clear) + u(ctx) + (es ? '' : ' away') : '');
    },
    // Decorative panels: carcass (the module size) and overall (bbox [[min],[max]] from the last build).
    deco: function (p, ctx) {
      if (!F.DECO(p)) { return ''; }
      var es = ctx.es, show = ctx.show;
      var n = (p.skin_l ? 1 : 0) + (p.skin_r ? 1 : 0), st = n * F.skinT(p);
      var cw = p.skin_add ? p.width : p.width - st;
      var txt = (es ? 'Caja ' : 'Carcass ') + show(cw) + ' × ' + show(p.height) + ' × ' + show(p.depth) + u(ctx);
      var bb = ctx.bbox;
      if (bb) {
        txt += (es ? ' · total ' : ' · overall ') + show(bb[1][0] - bb[0][0]) + ' × ' + show(bb[1][2] - bb[0][2]) +
               ' × ' + show(bb[1][1] - bb[0][1]) + u(ctx);
      }
      return txt + (es ? '  (ancho × alto × fondo)' : '  (W × H × D)');
    },
    // Metal box system: the sizes the system gives (or the ones typed by hand).
    box: function (p, ctx) {
      if (p.drawer_system !== 'box_system') { return ''; }
      var es = ctx.es, show = ctx.show;
      var b = F.BOXSYS[p.bx_brand] || F.BOXSYS.merivobox, bt = p.bx_bottom_t_same !== false ? p.t : p.bx_bottom_t;
      var txt = (es ? 'Lado ' : 'Side ') + show(p.bx_side_h) + ' · ' + (es ? 'fondo LW − ' : 'bottom LW − ') + show(p.bx_bottom_w_deduct) + ' × NL − ' + show(p.bx_bottom_d_deduct) +
        ' · ' + (es ? 'respaldo LW − ' : 'back LW − ') + show(p.bx_back_w_deduct) + ' × ' + show(p.bx_back_h) + u(ctx);
      if (bt > 16.05) { txt += ' · ' + (es ? 'cantos rebajados a 16 mm' : 'edges rebated to 16 mm'); }
      if (p.bx_custom || b.check) { txt += ' · ' + (es ? 'verifica con la tabla del fabricante' : 'check against the manufacturer’s table'); }
      return txt;
    },
    // Loose panel: the cut size.
    panel: function (p, ctx) {
      if (!p.panel) { return ''; }
      var es = ctx.es, show = ctx.show, k = p.panel_kind;
      var a = k === 'top' ? [p.width, p.depth] : k === 'side' ? [p.height, p.depth] : [p.width, p.height];
      return (es ? 'Panel ' : 'Panel ') + show(Math.max(a[0], a[1])) + ' × ' + show(Math.min(a[0], a[1])) + ' × ' + show(p.panel_t) + u(ctx) +
        (es ? ' — estírelo sobre los módulos o el hueco que cubre' : ' — stretch it over the modules or the gap it covers');
    }
  };
  // field key → readout
  R.INFO_KEYS = { fridge_info: 'fridge', corner_info: 'corner', deco_info: 'deco', bx_info: 'box', panel_info: 'panel' };

  // ------------------------------------------------------------------ sheet optimizer drawings + printable plan
  function escH(v) { return String(v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mm(v) { var r = Math.round(v * 10) / 10; return String(r); }
  var svgN = 0;

  // One sheet as SVG: x = sheet length (grain) left → right, y = sheet width.
  function sheetSvg(g, s, big) {
    var L = g.sheet[0], W = g.sheet[1], id = 'h' + (++svgN);
    var m = big ? { l: 150, t: 140, r: 20, b: 20 } : { l: 2, t: 2, r: 2, b: 2 };
    var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-m.l) + ' ' + (-m.t) + ' ' + (L + m.l + m.r) + ' ' + (W + m.t + m.b) + '">' +
      '<defs><pattern id="' + id + '" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="40" height="40" fill="#efe9de"/><line x1="0" y1="0" x2="0" y2="40" stroke="#d3c9b8" stroke-width="10"/></pattern></defs>' +
      '<rect x="0" y="0" width="' + L + '" height="' + W + '" fill="url(#' + id + ')" stroke="#7a756c" stroke-width="4"/>';
    if (big) {
      var dim = 'font-family="Segoe UI,Arial,sans-serif" font-size="56" fill="#7a756c" text-anchor="middle"';
      out += '<line x1="0" y1="-60" x2="' + L + '" y2="-60" stroke="#b9b2a6" stroke-width="3"/>' +
        '<line x1="0" y1="-85" x2="0" y2="-35" stroke="#b9b2a6" stroke-width="3"/><line x1="' + L + '" y1="-85" x2="' + L + '" y2="-35" stroke="#b9b2a6" stroke-width="3"/>' +
        '<rect x="' + (L / 2 - 210) + '" y="-100" width="420" height="80" fill="#fff"/>' +
        '<text x="' + (L / 2) + '" y="-40" ' + dim + '>' + mm(L) + ' mm →</text>' +
        '<line x1="-70" y1="0" x2="-70" y2="' + W + '" stroke="#b9b2a6" stroke-width="3"/>' +
        '<line x1="-95" y1="0" x2="-45" y2="0" stroke="#b9b2a6" stroke-width="3"/><line x1="-95" y1="' + W + '" x2="-45" y2="' + W + '" stroke="#b9b2a6" stroke-width="3"/>' +
        '<rect x="-110" y="' + (W / 2 - 160) + '" width="80" height="320" fill="#fff"/>' +
        '<text transform="translate(-50 ' + (W / 2) + ') rotate(-90)" ' + dim + '>' + mm(W) + ' mm</text>';
    }
    s.pieces.forEach(function (p) {
      out += '<rect x="' + p.x + '" y="' + p.y + '" width="' + p.dx + '" height="' + p.dy + '" fill="#f6dfc9" stroke="#b5652e" stroke-width="3"/>';
      var dims = mm(p.L) + ' × ' + mm(p.W) + (p.rot ? ' ↻' : '');
      var name = (p.code ? p.code + ' · ' : '') + p.part;
      var fs = Math.min(big ? 60 : 70, p.dy * 0.28, p.dx / (dims.length * 0.62));
      var cx = p.x + p.dx / 2, cy = p.y + p.dy / 2;
      if (fs < 14) { return; }
      var fs2 = Math.min(fs, p.dx / (name.length * 0.6));
      if (fs2 >= 14 && p.dy > fs * 2.6) {
        out += '<text x="' + cx + '" y="' + (cy - fs * 0.25) + '" font-size="' + fs2 + '" text-anchor="middle" fill="#24221f" font-family="Segoe UI,Arial,sans-serif" font-weight="700">' + escH(name) + '</text>' +
               '<text x="' + cx + '" y="' + (cy + fs * 0.95) + '" font-size="' + fs + '" text-anchor="middle" fill="#5d574e" font-family="Segoe UI,Arial,sans-serif">' + escH(dims) + '</text>';
      } else {
        out += '<text x="' + cx + '" y="' + (cy + fs * 0.35) + '" font-size="' + fs + '" text-anchor="middle" fill="#24221f" font-family="Segoe UI,Arial,sans-serif">' + escH(dims) + '</text>';
      }
    });
    return out + '</svg>';
  }

  // Costs: price per sheet per decor/thickness (Settings) and edge tape per metre.
  function money(v, ctx) {
    var o = (ctx.settings && ctx.settings.opt) || {};
    var r = Math.round(v * 100) / 100;
    return (o.currency || '') + ' ' + r.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function priceOf(g, ctx) { if (g.cost) { return g.cost.sheet_price; } var o = (ctx.settings && ctx.settings.opt) || {}; return ((o.prices || {})[g.key]) || 0; }
  function groupCost(g, ctx) {
    if (g.cost) { return { sheets: g.cost.sheets_cost, tape: g.cost.tape_cost }; } // whole sheets + whole tape rolls (core/costing.rb)
    var o = (ctx.settings && ctx.settings.opt) || {};
    return { sheets: g.sheets.length * priceOf(g, ctx), tape: g.tape_m * (o.tape_price || 0) };
  }
  function totalCost(d, ctx) {
    return d.groups.reduce(function (a, g) { var c = groupCost(g, ctx); return a + c.sheets + c.tape; }, 0);
  }

  function groupTitle(g) { return g.mat + ' · ' + mm(g.T) + ' mm'; }
  function groupMeta(g, ctx) {
    var t = ctx.t;
    return t('Sheet') + ' ' + mm(g.sheet[0]) + ' × ' + mm(g.sheet[1]) + ' (' + t(g.library ? 'board library' : 'default sheet') + ') · ' +
      g.parts + ' ' + t('parts') + ' · ' + g.sheets.length + ' ' + t(g.sheets.length === 1 ? 'sheet' : 'sheets') + ' · ' +
      t('waste') + ' ' + g.waste_pct + ' % · ' + t('edge tape') + ' ' + g.tape_m + ' m';
  }

  // Printable cutting plan (opened in the browser: print or save as PDF).
  // Page 1: summary. Then one sheet per page: drawing on the left, parts list on the right.
  R.optReport = function (d, ctx) {
    var t = ctx.t;
    var css = [
      '@page{size:A4 landscape;margin:14mm 16mm}',
      '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      'body{font:11.5px/1.45 "Segoe UI",Arial,sans-serif;color:#24221f;margin:0;background:#fff}',
      '.page{page-break-after:always;break-after:page;display:flex;flex-direction:column;min-height:176mm}.page:last-child{page-break-after:auto;break-after:auto}',
      '@media screen{body{background:#ece8e1;padding:24px 0}.page{width:265mm;min-height:182mm;margin:0 auto 24px;background:#fff;padding:14mm 16mm;box-shadow:0 2px 10px rgba(0,0,0,.12)}}',
      '.brand{display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.08em;color:#7a756c;text-transform:uppercase}',
      '.mark{width:12px;height:12px;border:2px solid #b5652e;border-radius:2px;box-shadow:inset 0 -4px 0 #b5652e}',
      '.head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #24221f;padding-bottom:10px;margin-bottom:18px}',
      'h1{font-size:22px;margin:6px 0 0;font-weight:700}h2{font-size:17px;margin:0}',
      '.sub{color:#7a756c;font-size:11.5px;margin-top:3px}.right{text-align:right}',
      '.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:12px;margin:4px 0 22px}',
      '.card{border:1px solid #e3dfd6;border-radius:8px;padding:12px 14px;background:#faf8f4}',
      '.card .v{font-size:24px;font-weight:700;line-height:1.1}.card .k{color:#7a756c;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}',
      'table{border-collapse:collapse;width:100%}th{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#7a756c;font-weight:600;text-align:left;border-bottom:1.5px solid #24221f;padding:6px 8px}',
      'td{border-bottom:1px solid #ebe7df;padding:6px 8px;vertical-align:top}td.n,th.n{text-align:right}tr.tot td{font-weight:700;border-bottom:none;border-top:1.5px solid #24221f}',
      '.sheethead{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #24221f;padding-bottom:8px;margin-bottom:16px}',
      '.chips{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.chip{background:#f1ece3;border-radius:99px;padding:3px 10px;font-size:11px}.chip b{font-weight:700}',
      '.body{display:grid;grid-template-columns:minmax(0,1fr) 84mm;gap:10mm;align-items:start}',
      '.draw{border:1px solid #e3dfd6;border-radius:8px;padding:8mm 8mm 6mm;background:#fff}.draw svg{width:100%;height:auto;display:block;max-height:128mm}',
      '.draw .legend svg{width:12px;height:12px;display:inline-block;max-height:none}.legend{display:flex;gap:16px;color:#7a756c;font-size:10.5px;margin-top:8px}.sw{display:inline-block;width:12px;height:12px;border-radius:2px;vertical-align:-2px;margin-right:5px}',
      '.parts td{padding:5px 6px;font-size:11px}.parts th{padding:5px 6px}.parts td.n{white-space:nowrap}.code{font-weight:700;white-space:nowrap}',
      '.warn{background:#fff4dc;color:#9a5a00;border-radius:6px;padding:8px 10px;margin:10px 0}',
      '.foot{margin-top:auto;padding-top:12px;color:#a39d92;font-size:10px;display:flex;justify-content:space-between}',
      '.np{position:fixed;top:12px;right:16px}.np button{font:inherit;background:#b5652e;color:#fff;border:0;border-radius:6px;padding:8px 14px;cursor:pointer}',
      '@media print{.np{display:none}}'
    ].join('');
    var title = t('Cutting plan') + (d.model ? ' — ' + d.model : '');
    var settingsTxt = t('Kerf') + ' ' + mm(d.settings.kerf) + ' mm · ' + t('trim') + ' ' + mm(d.settings.trim) + ' mm · ' + t('edge tape') + ' +' + mm(d.settings.tape_extra) + ' %';
    var nSheets = d.groups.reduce(function (a, g) { return a + g.sheets.length; }, 0);
    var nParts = d.groups.reduce(function (a, g) { return a + g.parts; }, 0);
    var aParts = d.groups.reduce(function (a, g) { return a + g.parts_m2; }, 0);
    var aSheets = d.groups.reduce(function (a, g) { return a + g.sheets_m2; }, 0);
    var waste = aSheets ? Math.round(1000 * (1 - aParts / aSheets)) / 10 : 0;
    var brand = '<div class="brand"><span class="mark"></span>CSPARTNERS PANEL PRO</div>';
    var foot = function (txt) { return '<div class="foot"><span>' + escH(title) + '</span><span>' + escH(txt) + '</span></div>'; };

    var h = '<!doctype html><html><head><meta charset="utf-8"><title>' + escH(title) + '</title><style>' + css + '</style></head><body>';
    h += '<div class="np"><button onclick="window.print()">' + escH(t('Print / save PDF…')) + '</button></div>';

    // summary page
    h += '<section class="page"><div class="head"><div>' + brand + '<h1>' + escH(title) + '</h1><div class="sub">' +
      escH(d.date + ' · ' + d.count + ' ' + t('modules')) + '</div></div><div class="right sub">' + escH(settingsTxt) + '</div></div>';
    h += '<div class="cards">' +
      '<div class="card"><div class="v">' + nSheets + '</div><div class="k">' + t('Sheets') + '</div></div>' +
      '<div class="card"><div class="v">' + nParts + '</div><div class="k">' + t('Parts') + '</div></div>' +
      '<div class="card"><div class="v">' + waste + ' %</div><div class="k">' + t('Waste') + '</div></div>' +
      '<div class="card"><div class="v">' + mm(d.tape_m) + ' m</div><div class="k">' + t('Edge tape') + '</div></div>' +
      (totalCost(d, ctx) ? '<div class="card"><div class="v">' + escH(money(totalCost(d, ctx), ctx)) + '</div><div class="k">' + t('Estimated cost') + '</div></div>' : '') + '</div>';
    h += '<table><thead><tr><th>' + t('Material') + '</th><th class="n">' + t('Thickness') + '</th><th>' + t('Sheet size') + '</th><th class="n">' + t('Parts') +
      '</th><th class="n">m²</th><th class="n">' + t('Sheets') + '</th><th class="n">' + t('Waste') + '</th><th class="n">' + t('Edge tape') + '</th>' +
      (totalCost(d, ctx) ? '<th class="n">' + t('Cost') + '</th>' : '') + '</tr></thead><tbody>';
    d.groups.forEach(function (g) {
      h += '<tr><td>' + escH(g.mat) + (g.rotate ? ' <span class="sub">(' + escH(t('no grain')) + ')</span>' : '') + '</td><td class="n">' + mm(g.T) + ' mm</td><td>' +
        mm(g.sheet[0]) + ' × ' + mm(g.sheet[1]) + '</td><td class="n">' + g.parts + '</td><td class="n">' + g.parts_m2 + '</td><td class="n"><b>' + g.sheets.length +
        '</b></td><td class="n">' + g.waste_pct + ' %</td><td class="n">' + g.tape_m + ' m</td>' +
        (totalCost(d, ctx) ? '<td class="n">' + (function (c) { return c.sheets || c.tape ? escH(money(c.sheets + c.tape, ctx)) : '—'; })(groupCost(g, ctx)) + '</td>' : '') + '</tr>';
    });
    h += '<tr class="tot"><td>' + t('Total') + '</td><td></td><td></td><td class="n">' + nParts + '</td><td class="n">' + (Math.round(aParts * 100) / 100) +
      '</td><td class="n">' + nSheets + '</td><td class="n">' + waste + ' %</td><td class="n">' + mm(d.tape_m) + ' m</td>' +
      (totalCost(d, ctx) ? '<td class="n">' + escH(money(totalCost(d, ctx), ctx)) + '</td>' : '') + '</tr></tbody></table>';
    d.groups.forEach(function (g) {
      if (g.oversize.length) { h += '<div class="warn"><b>⚠ ' + escH(groupTitle(g)) + ' — ' + escH(t('Too big for this sheet:')) + '</b> ' + escH(g.oversize.map(function (o) { return (o.code ? o.code + ' ' : '') + o.part + ' ' + mm(o.L) + ' × ' + mm(o.W); }).join(', ')) + '</div>'; }
    });
    h += '<p class="sub" style="margin-top:16px">' + escH(t('Sizes are finished sizes including the edge tape. Length (L) runs with the grain, along the sheet length.')) + '</p>';
    h += foot(t('Summary')) + '</section>';

    // one page per sheet
    var page = 1;
    d.groups.forEach(function (g) {
      g.sheets.forEach(function (s) {
        page += 1;
        var rows = {}, order = [];
        s.pieces.forEach(function (p) {
          var k = [p.code, p.part, p.L, p.W].join('|');
          if (!rows[k]) { rows[k] = { p: p, q: 0 }; order.push(k); }
          rows[k].q += 1;
        });
        h += '<section class="page"><div class="sheethead"><div>' + brand + '<h2>' + escH(t('Sheet') + ' ' + s.n + ' / ' + g.sheets.length) + ' — ' + escH(groupTitle(g)) + '</h2></div>' +
          '<div class="chips"><span class="chip">' + mm(g.sheet[0]) + ' × ' + mm(g.sheet[1]) + ' mm</span><span class="chip"><b>' + s.pieces.length + '</b> ' + t('parts') +
          '</span><span class="chip">' + t('waste') + ' <b>' + s.waste_pct + ' %</b></span><span class="chip">' + t('used') + ' ' + mm(s.used[0]) + ' × ' + mm(s.used[1]) + '</span></div></div>';
        h += '<div class="body"><div class="draw">' + sheetSvg(g, s, true) +
          '<div class="legend"><span><span class="sw" style="background:#f6dfc9;border:1px solid #b5652e"></span>' + escH(t('Part')) + ' — ' + escH(t('code · name, L × W')) + '</span>' +
          '<span><svg class="sw" width="12" height="12" viewBox="0 0 12 12" style="border:1px solid #b9b2a6"><rect width="12" height="12" fill="#efe9de"/><path d="M-2 4 L4 -2 M-2 10 L10 -2 M2 14 L14 2 M8 14 L14 8" stroke="#cfc5b4" stroke-width="1.6"/></svg>' + escH(t('Offcut / waste')) + '</span>' +
          (g.rotate ? '<span>↻ ' + escH(t('turned')) + '</span>' : '') + '</div></div>';
        h += '<div><table class="parts"><thead><tr><th>' + t('Code') + '</th><th>' + t('Panel') + '</th><th class="n">L</th><th class="n">W</th><th class="n">' + t('Qty') + '</th></tr></thead><tbody>';
        order.forEach(function (k) {
          var r = rows[k];
          h += '<tr><td class="code">' + escH(r.p.code) + '</td><td>' + escH(r.p.part) + '</td><td class="n">' + mm(r.p.L) + '</td><td class="n">' + mm(r.p.W) + '</td><td class="n">' + r.q + '</td></tr>';
        });
        h += '<tr class="tot"><td></td><td>' + t('Total') + '</td><td></td><td></td><td class="n">' + s.pieces.length + '</td></tr></tbody></table></div></div>';
        h += foot(t('Page') + ' ' + page) + '</section>';
      });
    });
    return h + '</body></html>';
  };


  R.escH = escH; R.mm = mm; R.sheetSvg = sheetSvg; R.money = money; R.priceOf = priceOf;
  R.groupCost = groupCost; R.totalCost = totalCost; R.groupTitle = groupTitle; R.groupMeta = groupMeta;
})();
