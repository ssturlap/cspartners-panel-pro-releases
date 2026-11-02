/* CSPARTNERS PANEL PRO — NOOKS editor (Layout tab), shared by the SketchUp Configurator and
 * PanelPro Web. The module interior as spaces you keep splitting: tap a space in the front
 * diagram, split it side by side (↔, a partition) or one above the other (↕, a fixed shelf),
 * set sizes, front and inside. The engine (core: Params.nook_norm, Builder#nooks_layout) builds it;
 * this file only edits the tree in params.nooks and draws the diagram from the last build.
 *
 *   PPNooks.render(host, ctx)
 *   ctx: { t, show(mm) → text, parse(text) → mm | null, units, params, layout (build result .nooks),
 *          sel (selected path), select(path), changed() }   — changed(): params.nooks was edited
 *   PPNooks.fromColumns(columns) → tree        PPNooks.leaves(tree) → [leaf]
 */
(function () {
  'use strict';

  var FRONTS = [['none', 'Open'], ['door', 'Door'], ['door_pair', 'Door pair'], ['drawer', 'Drawer'], ['false_front', 'False front']];
  var HINGES = [['L', 'Hinge left'], ['R', 'Hinge right'], ['T', 'Lift up'], ['B', 'Drop down']];
  var INSIDE = [['none', 'Empty'], ['shelves', 'Shelves'], ['hang', 'Hang rail']];
  var SHORT = { none: 'Open', door: 'Door', door_pair: 'Door pair', drawer: 'Drawer', false_front: 'False front' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function emptyLeaf() { return { size: 'auto', front: 'none', hinge: 'L', interior: 'none', shelves: 0, drawers: 1 }; }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }

  // ---- tree helpers (paths: '0' = the whole box, '0.1.0' = first part of the second part)
  function nodeAt(tree, path) {
    var n = tree, ix = String(path).split('.').slice(1);
    for (var i = 0; i < ix.length; i++) { if (!n || !n.parts) { return null; } n = n.parts[+ix[i]]; }
    return n;
  }
  function parentPath(path) { var a = String(path).split('.'); a.pop(); return a.join('.'); }
  function setAt(tree, path, node) {
    if (path === '0') { return node; }
    var pp = parentPath(path), i = +String(path).split('.').pop();
    nodeAt(tree, pp).parts[i] = node;
    return tree;
  }
  function leaves(tree, path, out) {
    out = out || []; path = path || '0';
    if (!tree) { return out; }
    if (tree.parts) { tree.parts.forEach(function (q, i) { leaves(q, path + '.' + i, out); }); } else { out.push(Object.assign({ path: path }, tree)); }
    return out;
  }
  // Today's columns and rows as nooks (same as Params.nooks_from_columns in the engine)
  function fromColumns(cols) {
    var parts = (cols || []).filter(function (c) { return c.kind !== 'kneehole'; }).map(function (c) {
      var rows = (c.rows || []).map(function (r) {
        var q = Object.assign(emptyLeaf(), r, { size: r.h === 'auto' || r.h == null ? 'auto' : r.h, front: String(r.front || 'none').replace(/^glass_/, '') });
        delete q.h; return q;
      });
      var node = rows.length > 1 ? { split: 'h', parts: rows } : (rows[0] || emptyLeaf());
      return Object.assign({}, node, { size: c.w == null ? 'auto' : c.w });
    });
    var root = parts.length > 1 ? { split: 'v', parts: parts } : (parts[0] || emptyLeaf());
    root.size = 'auto';
    return root;
  }

  // ---- editing
  function split(tree, path, dir, n) {
    var lf = nodeAt(tree, path);
    if (!lf || lf.parts) { return { tree: tree, sel: path }; }
    var first = copy(lf); first.size = 'auto';
    var parts = [first];
    for (var i = 1; i < n; i++) { parts.push(emptyLeaf()); }
    return { tree: setAt(tree, path, { size: lf.size || 'auto', split: dir, parts: parts }), sel: path + '.0' };
  }
  function merge(tree, path) {
    if (path === '0') { return { tree: tree, sel: path }; }
    var pp = parentPath(path), par = nodeAt(tree, pp), lf = copy(nodeAt(tree, path));
    if (lf.parts) { lf = copy(leaves(lf)[0]); delete lf.path; }
    lf.size = par.size || 'auto';
    return { tree: setAt(tree, pp, lf), sel: pp };
  }

  // ---- drawing
  var CSS = [
    '.nk{display:grid;gap:12px}',
    '.nk-svg{width:100%;max-height:420px;background:var(--nk-bg,#f6f1e8);border:1px solid var(--line,#ddd);border-radius:10px;touch-action:manipulation}',
    '.nk-svg .lf{fill:#fffdf8;stroke:none;cursor:pointer}.nk-svg .lf:hover{fill:#fff3d6}',
    '.nk-svg .lf.on{fill:#ffe69a}.nk-svg .cut{fill:#c79c66}.nk-svg .frame{fill:#c79c66}',
    '.nk-svg text{font-family:system-ui,sans-serif;font-weight:600;fill:#3b342b;pointer-events:none;text-anchor:middle}',
    '.nk-svg text.sz{font-weight:400;fill:#7a6f60}',
    '.nk-p{display:grid;gap:9px;border:1px solid var(--line,#ddd);border-radius:10px;padding:10px 12px;background:var(--panel,#fff)}',
    '.nk-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.nk-h b{font-size:14px}.nk-h small{color:var(--muted,#777)}',
    '.nk-r{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.nk-r>span.l{min-width:72px;color:var(--muted,#777);font-size:12px;text-transform:uppercase;letter-spacing:.04em;font-weight:700}',
    '.nk-seg{display:inline-flex;flex-wrap:wrap;gap:4px}.nk-seg button,.nk-b{font:inherit;font-size:12.5px;padding:5px 9px;border:1px solid var(--line,#ccc);border-radius:8px;background:#fff;color:inherit;cursor:pointer}',
    '.nk-seg button.on{background:var(--nk-on,#24221f);border-color:var(--nk-on,#24221f);color:#fff}',
    '.nk-b.go{background:var(--nk-go,#f3c623);border-color:#d9a900;font-weight:700}.nk-b.del{color:#c62828}',
    '.nk input.nk-n{width:76px;font:inherit;padding:5px 7px;border:1px solid var(--line,#ccc);border-radius:7px;text-align:right}',
    '.nk-auto{font:inherit;font-size:12px;padding:5px 8px;border:1px solid var(--line,#ccc);border-radius:8px;background:#fff;cursor:pointer}.nk-auto.on{background:var(--nk-on,#24221f);color:#fff;border-color:var(--nk-on,#24221f)}',
    '.nk-step{display:inline-flex;align-items:center;gap:6px}.nk-step button{width:28px;height:28px;border-radius:7px;border:1px solid var(--line,#ccc);background:#fff;cursor:pointer;font:inherit}',
    '.nk-hint{font-size:12px;color:var(--muted,#777)}'
  ].join('\n');

  function render(host, ctx) {
    if (!document.getElementById('nk-css')) { var st = document.createElement('style'); st.id = 'nk-css'; st.textContent = CSS; document.head.appendChild(st); }
    var t = ctx.t, p = ctx.params, L = ctx.layout;
    if (!p.nooks) { p.nooks = fromColumns(p.columns); }
    var sel = ctx.sel && nodeAt(p.nooks, ctx.sel) && !nodeAt(p.nooks, ctx.sel).parts ? ctx.sel : leaves(p.nooks)[0].path;
    var h = '<div class="nk">';
    // front diagram (from the last build); tap a nook to select it
    if (L && L.box) {
      var b = L.box, W = b[2] - b[0], H = b[3] - b[1], pad = 18, k = Math.max(W, H) / 600;
      h += '<svg class="nk-svg" viewBox="' + (b[0] - pad) + ' ' + (-b[3] - pad) + ' ' + (W + 2 * pad) + ' ' + (H + 2 * pad) + '">' +
        '<rect class="frame" x="' + (b[0] - pad) + '" y="' + (-b[3] - pad) + '" width="' + (W + 2 * pad) + '" height="' + (H + 2 * pad) + '" opacity=".35"/>' +
        L.cuts.map(function (c) { return '<rect class="cut" x="' + c.x0 + '" y="' + (-c.z1) + '" width="' + (c.x1 - c.x0) + '" height="' + (c.z1 - c.z0) + '"/>'; }).join('') +
        L.leaves.map(function (lf) {
          var cx = (lf.x0 + lf.x1) / 2, cy = -(lf.z0 + lf.z1) / 2, fs = Math.min(16 * k, lf.w / 6, lf.h / 3.2);
          var what = t(SHORT[lf.front] || 'Open') + (lf.front === 'drawer' && lf.drawers > 1 ? ' ×' + lf.drawers : '');
          return '<rect class="lf' + (lf.path === sel ? ' on' : '') + '" data-path="' + lf.path + '" x="' + lf.x0 + '" y="' + (-lf.z1) + '" width="' + lf.w + '" height="' + lf.h + '"/>' +
            (fs > 4 ? '<text x="' + cx + '" y="' + (cy - fs * 0.15) + '" font-size="' + fs + '">' + esc(what) + '</text>' +
              '<text class="sz" x="' + cx + '" y="' + (cy + fs * 1.05) + '" font-size="' + fs * 0.85 + '">' + esc(ctx.show(lf.w) + ' × ' + ctx.show(lf.h)) + '</text>' : '');
        }).join('') + '</svg>';
    } else {
      h += '<p class="nk-hint">' + esc(t('The diagram shows once the module builds.')) + '</p>';
    }
    // the selected nook
    var lf = nodeAt(p.nooks, sel), info = L && L.leaves ? L.leaves.filter(function (x) { return x.path === sel; })[0] : null;
    var par = sel === '0' ? null : nodeAt(p.nooks, parentPath(sel));
    h += '<div class="nk-p"><div class="nk-h"><b>' + esc(t('Nook') + (info ? ' ' + info.tag.replace(/^N/, '') : '')) + '</b>' +
      (info ? '<small>' + esc(ctx.show(info.w) + ' × ' + ctx.show(info.h) + ' ' + ctx.units) + '</small>' : '') + '</div>';
    if (par) {
      var auto = lf.size === 'auto' || lf.size == null, calc = info ? (par.split === 'v' ? info.w : info.h) : null;
      h += '<div class="nk-r"><span class="l">' + esc(t(par.split === 'v' ? 'Width' : 'Height')) + '</span>' +
        '<input class="nk-n" data-nk="size" value="' + esc(auto ? (calc ? ctx.show(calc) : '') : ctx.show(lf.size)) + '"' + (auto ? ' style="color:#888"' : '') + '>' +
        '<button type="button" class="nk-auto' + (auto ? ' on' : '') + '" data-nk="auto" data-calc="' + (calc || '') + '">↔ ' + esc(t('auto')) + '</button>' +
        '<span class="nk-hint">' + esc(t('clear size')) + '</span></div>';
    }
    h += '<div class="nk-r"><span class="l">' + esc(t('Split')) + '</span>' +
      '<button type="button" class="nk-b go" data-nk="split" data-dir="v">↔ ' + esc(t('Side by side')) + '</button>' +
      '<button type="button" class="nk-b go" data-nk="split" data-dir="h">↕ ' + esc(t('One above the other')) + '</button>' +
      '<span class="nk-step"><button type="button" data-nk="n" data-d="-1">−</button><b id="nkN">' + (ctx.n || 2) + '</b><button type="button" data-nk="n" data-d="1">+</button></span>' +
      (par ? '<button type="button" class="nk-b del" data-nk="merge">' + esc(t('Join (undo the split)')) + '</button>' : '') + '</div>';
    function seg(key, list, v) {
      return '<span class="nk-seg">' + list.map(function (o) {
        return '<button type="button" data-nk="set" data-k="' + key + '" data-v="' + o[0] + '" class="' + (String(v) === o[0] ? 'on' : '') + '">' + esc(t(o[1])) + '</button>';
      }).join('') + '</span>';
    }
    h += '<div class="nk-r"><span class="l">' + esc(t('Front')) + '</span>' + seg('front', FRONTS, lf.front) + '</div>';
    if (lf.front === 'door') { h += '<div class="nk-r"><span class="l">' + esc(t('Hinge')) + '</span>' + seg('hinge', HINGES, lf.hinge || 'L') + '</div>'; }
    if (lf.front === 'drawer') {
      h += '<div class="nk-r"><span class="l">' + esc(t('Drawers')) + '</span><span class="nk-step"><button type="button" data-nk="dr" data-d="-1">−</button><b>' + (lf.drawers || 1) +
        '</b><button type="button" data-nk="dr" data-d="1">+</button></span></div>';
    } else {
      h += '<div class="nk-r"><span class="l">' + esc(t('Inside')) + '</span>' + seg('interior', INSIDE, lf.interior || 'none') +
        (lf.interior === 'shelves' ? '<span class="nk-step"><button type="button" data-nk="sh" data-d="-1">−</button><b>' + (lf.shelves || 0) +
          '</b><button type="button" data-nk="sh" data-d="1">+</button></span>' : '') + '</div>';
    }
    h += '<div class="nk-hint">' + esc(t('Tap a space in the drawing to select it. ↔ adds partitions, ↕ adds fixed shelves; sizes are clear sizes between panels.')) + '</div></div></div>';
    host.innerHTML = h;

    function done(tree, nsel) { p.nooks = tree; ctx.select(nsel); ctx.changed(); }
    host.querySelectorAll('[data-path]').forEach(function (r) { r.addEventListener('click', function () { ctx.select(r.getAttribute('data-path')); }); });
    host.querySelectorAll('[data-nk]').forEach(function (b) {
      var a = b.getAttribute('data-nk');
      var ev = a === 'size' ? 'change' : 'click';
      b.addEventListener(ev, function () {
        var node = nodeAt(p.nooks, sel), d = +b.getAttribute('data-d');
        if (a === 'split') { var r1 = split(p.nooks, sel, b.getAttribute('data-dir'), ctx.n || 2); done(r1.tree, r1.sel); }
        else if (a === 'merge') { var r2 = merge(p.nooks, sel); done(r2.tree, r2.sel); }
        else if (a === 'n') { ctx.n = Math.max(2, Math.min(6, (ctx.n || 2) + d)); host.querySelector('#nkN').textContent = ctx.n; if (ctx.setN) { ctx.setN(ctx.n); } }
        else if (a === 'set') { node[b.getAttribute('data-k')] = b.getAttribute('data-v'); if (node.front === 'drawer') { node.drawers = node.drawers || 1; } done(p.nooks, sel); }
        else if (a === 'dr') { node.drawers = Math.max(1, Math.min(8, (node.drawers || 1) + d)); done(p.nooks, sel); }
        else if (a === 'sh') { node.shelves = Math.max(0, Math.min(12, (node.shelves || 0) + d)); done(p.nooks, sel); }
        else if (a === 'auto') {
          if (node.size === 'auto' || node.size == null) { var c = parseFloat(b.getAttribute('data-calc')); if (!(c > 0)) { return; } node.size = Math.round(c * 10) / 10; }
          else { node.size = 'auto'; }
          done(p.nooks, sel);
        } else if (a === 'size') {
          var v = ctx.parse(b.value);
          if (v == null || !(v > 0)) { done(p.nooks, sel); return; }
          node.size = v; done(p.nooks, sel);
        }
      });
    });
  }

  window.PPNooks = { render: render, fromColumns: fromColumns, leaves: leaves, nodeAt: nodeAt };
})();
