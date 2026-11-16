/* CSPARTNERS PANEL PRO — the composition form (top, back panel, side panels), shared by the
 * SketchUp plugin (ui/composition.html, right-click a composition) and PanelPro Web (a sheet over
 * the composition). Interface only: every size comes from the shared engine
 * (core/composition.rb) through ctx.plan.
 *
 *   PPCompForm.render(host, ctx)
 *   ctx: { t(text), show(mm) → text in the user's units, parse(text) → mm, units, lang,
 *          opts (stored choices), focus ('stone' | 'wood' | 'back' | 'sides' | null), name,
 *          mats: [material names], plan(opts, done(result)), apply(opts, result), cancel() }
 */
(function () {
  'use strict';

  var CSS = [
    '.cp{display:flex;flex-direction:column;gap:12px;font-size:13px;color:var(--ink,#24221f)}',
    '.cp h3{margin:0;font-size:15px}.cp .cp-sub{color:var(--muted,#7a756c);font-size:12px}',
    '.cp-card{border:1px solid var(--line,#e3dfd6);border-radius:10px;background:var(--panel,#fff);overflow:hidden}',
    '.cp-card>label.cp-head{display:flex;align-items:center;gap:10px;padding:10px 12px;font-weight:700;cursor:pointer}',
    '.cp-card>label.cp-head input{width:18px;height:18px;flex:none;accent-color:var(--accent,#b5652e)}',
    '.cp-card>label.cp-head small{font-weight:400;color:var(--muted,#7a756c);margin-left:auto;text-align:right}',
    '.cp-body{padding:6px 12px 12px;display:grid;gap:9px;border-top:1px solid var(--line,#e3dfd6)}',
    '.cp-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.cp-row>span.cp-l{min-width:130px;color:var(--muted,#7a756c)}',
    '.cp-seg{display:inline-flex;border:1px solid var(--line,#e3dfd6);border-radius:8px;overflow:hidden;flex-wrap:wrap}',
    '.cp-seg button{font:inherit;font-size:12px;border:0;background:transparent;padding:6px 9px;cursor:pointer;color:inherit}',
    '.cp-seg button+button{border-left:1px solid var(--line,#e3dfd6)}.cp-seg button.on{background:var(--accent,#b5652e);color:#fff}',
    '.cp input.cp-n{width:74px;font:inherit;padding:5px 7px;border:1px solid var(--line,#d5d0c6);border-radius:7px;text-align:right}',
    '.cp input.cp-t{flex:1;min-width:140px;font:inherit;padding:5px 7px;border:1px solid var(--line,#d5d0c6);border-radius:7px}',
    '.cp select{font:inherit;padding:5px 6px;border:1px solid var(--line,#d5d0c6);border-radius:7px;background:#fff}',
    '.cp-run{border:1px dashed var(--line,#d5d0c6);border-radius:8px;padding:8px 10px;display:grid;gap:7px}',
    '.cp-run b{font-weight:650}.cp-chk{display:inline-flex;gap:5px;align-items:center;cursor:pointer}',
    '.cp-mini{font:inherit;font-size:12px;padding:4px 8px;border-radius:7px;border:1px solid var(--line,#d5d0c6);background:#fff;cursor:pointer}',
    '.cp-list{display:grid;gap:4px}.cp-list div{display:flex;justify-content:space-between;gap:8px;padding:6px 10px;background:var(--soft,#f0ebe2);border-radius:7px}',
    '.cp-list b{font-weight:650}.cp-warn{color:var(--warn,#9a5a00);font-size:12px}.cp-err{color:#b3261e;font-size:12px;font-weight:600}',
    '.cp-btns{display:flex;gap:8px;justify-content:flex-end}.cp-btns button{font:inherit;font-weight:650;padding:9px 16px;border-radius:9px;border:1px solid var(--line,#d5d0c6);background:#fff;cursor:pointer}',
    '.cp-btns button.cp-go{background:var(--accent,#b5652e);border-color:var(--accent,#b5652e);color:#fff}.cp-btns button:disabled{opacity:.5;cursor:default}',
    '@media (max-width:480px){.cp-row>span.cp-l{min-width:100%}.cp input.cp-n{width:62px}.cp-card>label.cp-head small{display:none}}'
  ].join('\n');

  var LOOKS = [['marble_white', 'White marble'], ['granite_grey', 'Grey granite'], ['granite_black', 'Black granite']];
  var EB = [['front', 'One long edge (the one in view)'], ['long', 'Both long edges'], ['all', 'All four edges'], ['none', 'None']];
  var TOP0 = { type: 'stone', t: 20, look: 'marble_white', front: 'doors', front_oh: 20, back_oh: 0, back: 'none', max_l: 3000, mat: '', eb: 'front' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clone(o) { return JSON.parse(JSON.stringify(o || {})); }

  function render(host, ctx) {
    var t = ctx.t, show = ctx.show, U = ctx.units;
    if (!document.getElementById('cp-css')) { var st = document.createElement('style'); st.id = 'cp-css'; st.textContent = CSS; document.head.appendChild(st); }
    var opts = clone(ctx.opts);
    if (opts.top) { opts.top = Object.assign({}, TOP0, opts.top.type === 'wood' ? { t: 0, front_oh: 0 } : {}, opts.top); }
    var spare = { top: Object.assign({}, TOP0), back: { t: 0, mat: '', eb: 'front' }, sides: { t: 0, mat: '', eb: 'front' } };
    if (ctx.focus === 'stone' || ctx.focus === 'wood') {
      opts.top = opts.top || Object.assign({}, TOP0);
      if (opts.top.type !== ctx.focus) { opts.top.type = ctx.focus; opts.top.t = ctx.focus === 'stone' ? 20 : 0; opts.top.front_oh = ctx.focus === 'stone' ? 20 : 0; }
    }
    if (ctx.focus === 'back') { opts.back = opts.back || clone(spare.back); }
    if (ctx.focus === 'sides') { opts.sides = opts.sides || clone(spare.sides); }
    var last = null, trimCustom = false;

    function get(path) { var o = opts; path.split('.').forEach(function (k) { o = o == null ? undefined : o[k]; }); return o; }
    function set(path, v) {
      var a = path.split('.'), o = opts;
      for (var i = 0; i < a.length - 1; i++) { if (o[a[i]] == null || typeof o[a[i]] !== 'object') { o[a[i]] = {}; } o = o[a[i]]; }
      o[a[a.length - 1]] = v;
    }
    function seg(path, value, list) {
      return '<span class="cp-seg">' + list.map(function (o) {
        return '<button type="button" data-seg="' + path + '" data-v="' + o[0] + '" class="' + (String(value) === String(o[0]) ? 'on' : '') + '">' + esc(t(o[1])) + '</button>';
      }).join('') + '</span>';
    }
    function num(path, v, ph) { return '<input class="cp-n" data-num="' + path + '" value="' + (v == null || v === '' ? '' : esc(show(v))) + '"' + (ph != null ? ' placeholder="' + esc(ph) + '"' : '') + ' inputmode="decimal">'; }
    function row(label, html) { return '<div class="cp-row"><span class="cp-l">' + esc(t(label)) + '</span>' + html + '</div>'; }
    function chk(path, on, label) { return '<label class="cp-chk"><input type="checkbox" data-chk="' + path + '"' + (on ? ' checked' : '') + '>' + esc(label) + '</label>'; }
    function matRow(sec) {
      return row('Material', '<input class="cp-t" data-txt="' + sec + '.mat" list="cp-mats" value="' + esc(get(sec + '.mat') || '') + '" placeholder="' + esc(t('Same as the fronts')) + '">') +
        row('Edge banding', '<select data-sel="' + sec + '.eb">' + EB.map(function (e) { return '<option value="' + e[0] + '"' + ((get(sec + '.eb') || 'front') === e[0] ? ' selected' : '') + '>' + esc(t(e[1])) + '</option>'; }).join('') + '</select>') +
        row('Thickness', num(sec + '.t', get(sec + '.t') || '') + ' <span class="cp-sub">' + esc(t('empty = same as the panels')) + '</span>');
    }
    function segs() { return (last && last.segs) || []; }
    function runName(id) { var i = segs().findIndex(function (s) { return s.id === id; }); return t('Run') + ' ' + (i + 1); }

    function topCard() {
      var o = opts.top, on = !!o;
      var h = '<div class="cp-card"><label class="cp-head"><input type="checkbox" data-sec="top"' + (on ? ' checked' : '') + '>' + esc(t('Top')) +
        '<small>' + esc(t('Stone (granite / marble) or a wood panel over all the modules')) + '</small></label>';
      if (!on) { return h + '</div>'; }
      var stone = o.type !== 'wood';
      h += '<div class="cp-body">' + row('Top', seg('top.type', stone ? 'stone' : 'wood', [['stone', 'Stone'], ['wood', 'Wood panel']]));
      if (stone) {
        h += row('Slab', seg('top.t', Number(o.t) >= 30 ? 40 : 20, [[20, 'Single 2 cm slab'], [40, '4 cm (doubled, double bullnose)']])) +
          row('Stone', '<select data-sel="top.look">' + LOOKS.map(function (l) { return '<option value="' + l[0] + '"' + (o.look === l[0] ? ' selected' : '') + '>' + esc(t(l[1])) + '</option>'; }).join('') + '</select>');
      } else {
        h += row('Thickness', num('top.t', o.t || '') + ' <span class="cp-sub">' + esc(t('empty = same as the panels')) + '</span>') +
          row('Material', '<input class="cp-t" data-txt="top.mat" list="cp-mats" value="' + esc(o.mat || '') + '" placeholder="' + esc(t('Same as the fronts')) + '">') +
          row('Edge banding', '<select data-sel="top.eb">' + EB.map(function (e) { return '<option value="' + e[0] + '"' + ((o.eb || 'front') === e[0] ? ' selected' : '') + '>' + esc(t(e[1])) + '</option>'; }).join('') + '</select>');
      }
      h += row('Front overhang', num('top.front_oh', o.front_oh || 0) + ' ' + seg('top.front', o.front || 'doors', [['doors', 'From the fronts'], ['carcass', 'From the carcass']])) +
        row('Back overhang', num('top.back_oh', o.back_oh || 0) + ' <span class="cp-sub">' + esc(U) + '</span>');
      if (stone) {
        var bh = Number(o.back_h) || 0, tv = trimCustom || (bh && bh !== 70 && bh !== 100) ? 'custom' : String(bh || 70);
        var auto = segs().map(function (s) { return s.back_h; }).filter(function (v) { return v; })[0];
        h += row('Along the back', seg('top.back', o.back || 'none', [['none', 'None'], ['trim', 'Trim'], ['splash', 'Backsplash']]));
        if (o.back === 'trim') {
          h += row('Trim height', seg('trimh', tv, [['70', '7 cm'], ['100', '10 cm'], ['custom', 'Custom']]) + (tv === 'custom' ? ' ' + num('top.back_h', bh || '') : ''));
        } else if (o.back === 'splash') {
          h += row('Backsplash height', num('top.back_h', o.back_h || '', auto ? show(auto) : '') + ' <span class="cp-sub">' + esc(t('empty = up to the wall cabinets (60 cm without them)')) + '</span>');
        }
        h += row('Longest slab', num('top.max_l', o.max_l || 3000) + ' <span class="cp-sub">' + esc(U) + '</span>');
      }
      // each run: its ends and its joints
      segs().forEach(function (s, i) {
        var sp = (o.splits || {})[s.id];
        h += '<div class="cp-run"><div><b>' + esc(runName(s.id)) + '</b> <span class="cp-sub">' + esc(s.codes + ' · ' + t('top') + ' ' + show(s.top_len || 0) + ' ' + U) + '</span></div>';
        ['l', 'r'].forEach(function (e) {
          var en = s.ends[e], key = s.id + e, lab = t(e === 'l' ? 'Left end' : 'Right end');
          if (en.corner) { h += '<div class="cp-row"><span class="cp-l">' + esc(lab) + '</span><span class="cp-sub">' + esc(t('Corner (butt joint)')) + '</span></div>'; return; }
          h += '<div class="cp-row"><span class="cp-l">' + esc(lab) + '</span>' + esc(t('Overhang')) + ' ' + num('top.ends.' + key + '.oh', en.oh || 0) + ' ' +
            chk('top.ends.' + key + '.wall', en.wall, t(stone ? 'Against a wall (trim / backsplash returns)' : 'Against a wall')) + '</div>';
        });
        h += '<div class="cp-row"><span class="cp-l">' + esc(t('Joints')) + '</span><input class="cp-t" data-joints="' + s.id + '" value="' + esc((s.splits || []).map(show).join(', ')) +
          '" placeholder="' + esc(t('none')) + '"> ' + (Array.isArray(sp) ? '<button type="button" class="cp-mini" data-auto="' + s.id + '">' + esc(t('Automatic')) + '</button>' : '<span class="cp-sub">' + esc(t('automatic')) + '</span>') + '</div>' +
          '<div class="cp-sub">' + esc(t('Joints: distances from the left end of the top, separated by commas.')) + '</div></div>';
        i = i; // eslint
      });
      ((last && last.corners) || []).forEach(function (c) {
        h += row(t('Corner') + ' ' + runName(c.a) + ' / ' + runName(c.b), seg('top.through.' + c.id, c.through || c.a, [[c.a, runName(c.a) + ' ' + t('runs through')], [c.b, runName(c.b) + ' ' + t('runs through')]]));
      });
      return h + '</div></div>';
    }

    function backCard() {
      var o = opts.back, on = !!o;
      var h = '<div class="cp-card"><label class="cp-head"><input type="checkbox" data-sec="back"' + (on ? ' checked' : '') + '>' + esc(t('Back panel')) +
        '<small>' + esc(t('Covers the back of the modules, floor to the top')) + '</small></label>';
      if (!on) { return h + '</div>'; }
      h += '<div class="cp-body">';
      if (segs().length > 1) {
        h += row('On', segs().map(function (s) { return chk('back.segs.' + s.id, s.back_on, runName(s.id) + ' (' + s.codes + ')'); }).join(' '));
      }
      return h + matRow('back') + '</div></div>';
    }

    function sidesCard() {
      var o = opts.sides, on = !!o;
      var h = '<div class="cp-card"><label class="cp-head"><input type="checkbox" data-sec="sides"' + (on ? ' checked' : '') + '>' + esc(t('Side panels')) +
        '<small>' + esc(t('Decorative end panels at the open ends')) + '</small></label>';
      if (!on) { return h + '</div>'; }
      var ends = [];
      segs().forEach(function (s) {
        ['l', 'r'].forEach(function (e) {
          if (!s.ends[e].corner) { ends.push(chk('sides.ends.' + s.id + e, s.ends[e].side, (segs().length > 1 ? runName(s.id) + ' — ' : '') + t(e === 'l' ? 'left' : 'right'))); }
        });
      });
      return h + '<div class="cp-body">' + row('Ends', ends.join(' ') || '<span class="cp-sub">' + esc(t('none')) + '</span>') + matRow('sides') + '</div></div>';
    }

    function summaryHtml() {
      if (!last) { return '<div class="cp-sub">…</div>'; }
      var h = '<div class="cp-list">' + (last.pieces || []).map(function (p) {
        return '<div><b>' + esc(p.name) + '</b><span>' + esc(p.size.map(show).join(' × ')) + '</span></div>';
      }).join('') + '</div>';
      h += (last.errors || []).map(function (e) { return '<div class="cp-err">' + esc(e) + '</div>'; }).join('');
      h += (last.warnings || []).map(function (w) { return '<div class="cp-warn">⚠ ' + esc(w) + '</div>'; }).join('');
      if ((last.stone_off || []).length) { h += '<div class="cp-sub">' + esc(t('The modules’ own stone tops are switched off (this top replaces them).')) + '</div>'; }
      return h;
    }
    function ready() { return last && !(last.errors || []).length; }

    function draw() {
      var y = host.scrollTop;
      host.innerHTML = '<div class="cp"><div><h3>' + esc(ctx.name || t('Composition')) + '</h3><div class="cp-sub">' +
        esc(segs().map(function (s) { return runName(s.id) + ': ' + s.codes; }).join(' · ')) + '</div></div>' +
        topCard() + backCard() + sidesCard() + '<div id="cp-sum">' + summaryHtml() + '</div>' +
        '<datalist id="cp-mats">' + (ctx.mats || []).map(function (m) { return '<option value="' + esc(m) + '">'; }).join('') + '</datalist>' +
        '<div class="cp-btns"><button type="button" data-act="cancel">' + esc(t('Cancel')) + '</button>' +
        '<button type="button" class="cp-go" data-act="apply"' + (ready() ? '' : ' disabled') + '>' + esc(t('Apply')) + '</button></div></div>';
      host.scrollTop = y;
      wire();
    }

    function replan() {
      ctx.plan(clone(opts), function (res) { last = res; draw(); });
    }

    function wire() {
      host.querySelectorAll('[data-sec]').forEach(function (cb) {
        cb.onchange = function () {
          var k = cb.getAttribute('data-sec');
          if (cb.checked) { opts[k] = opts[k] || spare[k]; } else { spare[k] = opts[k] || spare[k]; delete opts[k]; }
          replan();
        };
      });
      host.querySelectorAll('[data-seg]').forEach(function (b) {
        b.onclick = function () {
          var p = b.getAttribute('data-seg'), v = b.getAttribute('data-v');
          if (p === 'trimh') { trimCustom = v === 'custom'; if (!trimCustom) { opts.top.back_h = +v; } replan(); return; }
          if (p === 'top.type') { opts.top.type = v; opts.top.t = v === 'stone' ? 20 : 0; }
          else if (p === 'top.t') { set(p, +v); }
          else { set(p, v); }
          if (p === 'top.back') { opts.top.back_h = v === 'trim' ? 70 : ''; trimCustom = false; }
          replan();
        };
      });
      host.querySelectorAll('[data-num]').forEach(function (inp) {
        inp.onchange = function () {
          var p = inp.getAttribute('data-num'), raw = inp.value.trim();
          if (raw === '') { set(p, ''); replan(); return; }
          var v = ctx.parse(raw);
          if (v == null || !isFinite(v)) { inp.value = ''; return; }
          set(p, v); replan();
        };
      });
      host.querySelectorAll('[data-chk]').forEach(function (cb) { cb.onchange = function () { set(cb.getAttribute('data-chk'), cb.checked); replan(); }; });
      host.querySelectorAll('[data-sel]').forEach(function (s) { s.onchange = function () { set(s.getAttribute('data-sel'), s.value); replan(); }; });
      host.querySelectorAll('[data-txt]').forEach(function (s) { s.onchange = function () { set(s.getAttribute('data-txt'), s.value.trim()); replan(); }; });
      host.querySelectorAll('[data-joints]').forEach(function (inp) {
        inp.onchange = function () {
          var list = inp.value.split(/[,;\s]+/).filter(Boolean).map(function (x) { return ctx.parse(x); }).filter(function (v) { return v != null && isFinite(v) && v > 0; });
          set('top.splits.' + inp.getAttribute('data-joints'), list.sort(function (a, b) { return a - b; }));
          replan();
        };
      });
      host.querySelectorAll('[data-auto]').forEach(function (b) {
        b.onclick = function () { if (opts.top && opts.top.splits) { delete opts.top.splits[b.getAttribute('data-auto')]; } replan(); };
      });
      host.querySelector('[data-act=cancel]').onclick = function () { ctx.cancel(); };
      host.querySelector('[data-act=apply]').onclick = function () { if (ready()) { ctx.apply(clone(opts), last); } };
    }

    draw();
    replan();
  }

  window.PPCompForm = { render: render };
})();
