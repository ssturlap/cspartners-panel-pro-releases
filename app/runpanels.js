/* CSPARTNERS PANEL PRO — "Panels for a run" form, shared by the SketchUp plugin (its own small
 * dialog) and PanelPro Web (a sheet over the composition). Interface only: the sizes come from
 * the shared engine (core/runpanels.rb) through ctx.plan.
 *
 *   PPRunPanels.render(host, ctx)
 *   ctx: { t(text), show(mm) → text in the user's units, parse(text) → mm, units,
 *          run (RunPanels.measure result), mats: [material names], lang,
 *          plan(opts, done(result)), create(opts), cancel() }
 */
(function () {
  'use strict';

  var CSS = [
    '.rp{display:flex;flex-direction:column;gap:12px;font-size:13px;color:var(--ink,#24221f)}',
    '.rp h3{margin:0;font-size:15px}.rp .rp-sub{color:var(--muted,#7a756c);font-size:12px}',
    '.rp-card{border:1px solid var(--line,#e3dfd6);border-radius:10px;background:var(--panel,#fff);overflow:hidden}',
    '.rp-card>label.rp-head{display:flex;align-items:center;gap:10px;padding:10px 12px;font-weight:700;cursor:pointer}',
    '.rp-card>label.rp-head input{width:18px;height:18px;accent-color:var(--accent,#b5652e)}',
    '.rp-card>label.rp-head small{font-weight:400;color:var(--muted,#7a756c);margin-left:auto;text-align:right}',
    '.rp-body{padding:4px 12px 12px;display:grid;gap:8px;border-top:1px solid var(--line,#e3dfd6)}',
    '.rp-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.rp-row>span.rp-l{min-width:110px;color:var(--muted,#7a756c)}',
    '.rp-seg{display:inline-flex;border:1px solid var(--line,#e3dfd6);border-radius:8px;overflow:hidden}',
    '.rp-seg button{font:inherit;font-size:12px;border:0;background:transparent;padding:6px 9px;cursor:pointer;color:inherit}',
    '.rp-seg button+button{border-left:1px solid var(--line,#e3dfd6)}',
    '.rp-seg button.on{background:var(--accent,#b5652e);color:#fff}',
    '.rp input.rp-n{width:74px;font:inherit;padding:5px 7px;border:1px solid var(--line,#d5d0c6);border-radius:7px;text-align:right}',
    '.rp input.rp-m{flex:1;min-width:140px;font:inherit;padding:5px 7px;border:1px solid var(--line,#d5d0c6);border-radius:7px}',
    '.rp select{font:inherit;padding:5px 6px;border:1px solid var(--line,#d5d0c6);border-radius:7px;background:#fff}',
    '.rp-seams{display:flex;flex-wrap:wrap;gap:6px}.rp-seams label{display:inline-flex;gap:4px;align-items:center;border:1px solid var(--line,#e3dfd6);border-radius:7px;padding:4px 7px;cursor:pointer}',
    '.rp-list{display:grid;gap:4px}.rp-list div{display:flex;justify-content:space-between;gap:8px;padding:6px 10px;background:var(--soft,#f0ebe2);border-radius:7px}',
    '.rp-list b{font-weight:650}.rp-warn{color:var(--warn,#9a5a00);font-size:12px}.rp-err{color:#b3261e;font-size:12px;font-weight:600}',
    '@media (max-width:480px){.rp-row>span.rp-l{min-width:100%}.rp input.rp-n{width:62px}.rp-card>label.rp-head small{display:none}}',
    '.rp-card>label.rp-head input{flex:none}',
    '.rp-btns{display:flex;gap:8px;justify-content:flex-end}.rp-btns button{font:inherit;font-weight:650;padding:9px 16px;border-radius:9px;border:1px solid var(--line,#d5d0c6);background:#fff;cursor:pointer}',
    '.rp-btns button.rp-go{background:var(--accent,#b5652e);border-color:var(--accent,#b5652e);color:#fff}.rp-btns button:disabled{opacity:.5;cursor:default}'
  ].join('\n');

  var KINDS = [
    ['bottom', 'Under', 'Underpanel: lies flat under the run and hides the joints'],
    ['top', 'Above', 'Overpanel: lies flat on top of the run'],
    ['crown', 'Crown', 'Crown: strip on edge on top of the run, up to the ceiling']
  ];
  var EB = [['front', 'One long edge (the one in view)'], ['long', 'Both long edges'], ['all', 'All four edges'], ['none', 'None']];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function render(host, ctx) {
    var t = ctx.t, show = ctx.show, run = ctx.run;
    if (!document.getElementById('rp-css')) { var st = document.createElement('style'); st.id = 'rp-css'; st.textContent = CSS; document.head.appendChild(st); }
    var opts = { pieces: { bottom: { front: 'doors', side_l: 0, side_r: 0, eb: 'front', mat: '' } }, split: 'auto', lang: ctx.lang };
    var spare = {
      bottom: { front: 'doors', side_l: 0, side_r: 0, eb: 'front', mat: '' },
      top: { front: 'doors', side_l: 0, side_r: 0, eb: 'front', mat: '' },
      crown: { front: 'doors', side_l: 0, side_r: 0, eb: 'front', mat: '', h_mode: 'ceiling', ceiling: 2400, height: 100 }
    };
    var last = null;

    function seg(name, value, list) {
      return '<span class="rp-seg">' + list.map(function (o) {
        return '<button type="button" data-seg="' + name + '" data-v="' + o[0] + '" class="' + (String(value) === o[0] ? 'on' : '') + '">' + esc(t(o[1])) + '</button>';
      }).join('') + '</span>';
    }
    function num(name, v) { return '<input class="rp-n" data-num="' + name + '" value="' + esc(show(v)) + '" inputmode="decimal">'; }

    function card(k) {
      var o = opts.pieces[k[0]] || spare[k[0]], on = !!opts.pieces[k[0]], p = k[0] + '.';
      var h = '<div class="rp-card"><label class="rp-head"><input type="checkbox" data-kind="' + k[0] + '"' + (on ? ' checked' : '') + '>' +
        esc(t(k[1])) + '<small>' + esc(t(k[2])) + '</small></label>';
      if (on) {
        h += '<div class="rp-body">' +
          '<div class="rp-row"><span class="rp-l">' + esc(t('Front')) + '</span>' +
          seg(p + 'front', o.front, [['doors', 'Cover the doors'], ['carcass', 'Carcass only'], ['custom', 'Custom']]) +
          (o.front === 'custom' ? ' ' + num(p + 'front_oh', o.front_oh || 0) + ' <span class="rp-sub">' + esc(t('in front of the carcass')) + '</span>' : '') + '</div>' +
          '<div class="rp-row"><span class="rp-l">' + esc(t('Side overhang')) + '</span>' + esc(t('Left')) + ' ' + num(p + 'side_l', o.side_l) + ' ' +
          esc(t('Right')) + ' ' + num(p + 'side_r', o.side_r) + ' <span class="rp-sub">' + esc(ctx.units) + '</span></div>';
        if (k[0] === 'crown') {
          h += '<div class="rp-row"><span class="rp-l">' + esc(t('Height')) + '</span>' +
            seg(p + 'h_mode', o.h_mode, [['ceiling', 'Ceiling height'], ['height', 'Strip height']]) + ' ' +
            (o.h_mode === 'height' ? num(p + 'height', o.height) : num(p + 'ceiling', o.ceiling) + ' <span class="rp-sub">' + esc(t('from the floor')) + '</span>') + '</div>';
        }
        h += '<div class="rp-row"><span class="rp-l">' + esc(t('Edge banding')) + '</span><select data-sel="' + p + 'eb">' +
          EB.map(function (e) { return '<option value="' + e[0] + '"' + (o.eb === e[0] ? ' selected' : '') + '>' + esc(t(e[1])) + '</option>'; }).join('') + '</select></div>' +
          '<div class="rp-row"><span class="rp-l">' + esc(t('Material')) + '</span><input class="rp-m" data-mat="' + p + 'mat" list="rp-mats" value="' + esc(o.mat) +
          '" placeholder="' + esc(run.mat_front + ' (' + t('fronts') + ')') + '"></div>' +
          '</div>';
      }
      return h + '</div>';
    }

    function seamsHtml() {
      if (!run.seams.length) { return ''; }
      var manual = Array.isArray(opts.split), chosen = manual ? opts.split : (last && Array.isArray(last.split) ? last.split : []);
      return '<div class="rp-card"><div class="rp-body" style="border-top:0;padding-top:10px">' +
        '<div class="rp-row"><span class="rp-l">' + esc(t('Joints')) + '</span>' +
        seg('split', manual ? 'pick' : opts.split, [['auto', 'Best on seams'], ['middle', 'Cut in the middle'], ['pick', 'Choose seams']]) + '</div>' +
        (manual ? '<div class="rp-seams">' + run.seams.map(function (s) {
          return '<label><input type="checkbox" data-seam="' + s.i + '"' + (chosen.indexOf(s.i) >= 0 ? ' checked' : '') + '>' + esc(s.between) + '</label>';
        }).join('') + '</div>' : '') +
        '<div class="rp-sub">' + esc(t('Usable board length')) + ': ' + esc(show(last ? last.usable : 0)) + ' ' + esc(ctx.units) + '</div>' +
        '</div></div>';
    }

    function summaryHtml() {
      if (!last) { return '<div class="rp-sub">…</div>'; }
      var h = '<div class="rp-list">' + last.pieces.map(function (p) {
        return '<div><b>' + esc(p.name) + '</b><span>' + esc(show(p.size[0]) + ' × ' + show(p.size[1]) + ' × ' + show(p.size[2])) + '</span></div>';
      }).join('') + '</div>';
      h += (last.errors || []).map(function (e) { return '<div class="rp-err">' + esc(e) + '</div>'; }).join('');
      h += (last.warnings || []).map(function (w) { return '<div class="rp-warn">⚠ ' + esc(w) + '</div>'; }).join('');
      return h;
    }

    function draw() {
      var len = run.x1 - run.x0;
      host.innerHTML = '<div class="rp"><div><h3>' + esc(t('Panels for the selected run')) + '</h3><div class="rp-sub">' +
        esc(run.mods.length + ' ' + t(run.mods.length === 1 ? 'module' : 'modules') + ' · ' + run.mods.map(function (m) { return m.code; }).join(' ') + ' · ' +
        t('run') + ' ' + show(len) + ' ' + ctx.units) + '</div></div>' +
        KINDS.map(card).join('') + seamsHtml() +
        '<div id="rp-sum">' + summaryHtml() + '</div>' +
        '<datalist id="rp-mats">' + (ctx.mats || []).map(function (m) { return '<option value="' + esc(m) + '">'; }).join('') + '</datalist>' +
        '<div class="rp-btns"><button type="button" data-act="cancel">' + esc(t('Cancel')) + '</button>' +
        '<button type="button" class="rp-go" data-act="create"' + (ready() ? '' : ' disabled') + '>' + esc(t('Create panels')) + '</button></div></div>';
      wire();
    }
    function ready() { return last && last.pieces.length && !(last.errors || []).length; }

    function replan(full) {
      ctx.plan(JSON.parse(JSON.stringify(opts)), function (res) {
        last = res;
        if (full) { draw(); return; }
        var sum = host.querySelector('#rp-sum');
        if (sum) { sum.innerHTML = summaryHtml(); }
        var go = host.querySelector('[data-act=create]');
        if (go) { go.disabled = !ready(); }
      });
    }

    function at(path) { var a = path.split('.'); return a.length === 2 ? [opts.pieces[a[0]], a[1]] : [opts, a[0]]; }

    function wire() {
      host.querySelectorAll('[data-kind]').forEach(function (cb) {
        cb.onchange = function () {
          var k = cb.getAttribute('data-kind');
          if (cb.checked) { opts.pieces[k] = opts.pieces[k] || spare[k]; } else { spare[k] = opts.pieces[k] || spare[k]; delete opts.pieces[k]; }
          draw(); replan(true);
        };
      });
      host.querySelectorAll('[data-seg]').forEach(function (b) {
        b.onclick = function () {
          var name = b.getAttribute('data-seg'), v = b.getAttribute('data-v');
          if (name === 'split') { opts.split = v === 'pick' ? (last && Array.isArray(last.split) ? last.split.slice() : []) : v; }
          else { var r = at(name); r[0][r[1]] = v; }
          draw(); replan(true);
        };
      });
      host.querySelectorAll('[data-num]').forEach(function (inp) {
        inp.onchange = function () {
          var v = ctx.parse(inp.value), r = at(inp.getAttribute('data-num'));
          if (v == null || !isFinite(v)) { inp.value = show(r[0][r[1]]); return; }
          r[0][r[1]] = v; inp.value = show(v); replan(false);
        };
      });
      host.querySelectorAll('[data-sel]').forEach(function (s) {
        s.onchange = function () { var r = at(s.getAttribute('data-sel')); r[0][r[1]] = s.value; replan(false); };
      });
      host.querySelectorAll('[data-mat]').forEach(function (s) {
        s.onchange = function () { var r = at(s.getAttribute('data-mat')); r[0][r[1]] = s.value.trim(); replan(false); };
      });
      host.querySelectorAll('[data-seam]').forEach(function (cb) {
        cb.onchange = function () {
          var i = +cb.getAttribute('data-seam');
          opts.split = (Array.isArray(opts.split) ? opts.split : []).filter(function (x) { return x !== i; });
          if (cb.checked) { opts.split.push(i); }
          opts.split.sort(function (a, b) { return a - b; });
          replan(false);
        };
      });
      host.querySelector('[data-act=cancel]').onclick = function () { ctx.cancel(); };
      host.querySelector('[data-act=create]').onclick = function () { if (ready()) { ctx.create(JSON.parse(JSON.stringify(opts)), last); } };
    }

    draw();
    replan(true);
  }

  window.PPRunPanels = { render: render };
})();
