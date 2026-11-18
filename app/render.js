/* CSPARTNERS PANEL PRO — AI renders, shared by the SketchUp plugin (ui/render.html) and PanelPro Web
 * (a panel over the 3D view). The view is captured by the app (ctx.capture), the server
 * (cloud/functions: renderCall / pluginRender) turns it into a photoreal picture with the image
 * model, and every tweak makes a new version from the one picked. All versions are kept on the
 * server with the project; any of them can be picked again, tweaked or saved.
 *
 *   PPRender.open(host, ctx)
 *   ctx: { t(text), lang, app: 'plugin' | 'web', site, title,
 *          scenes: [keys], scene (default key), photo: bool (the app can lay the view over a photo),
 *          call(action, data) → Promise(result)      the server (status, list, new, tweak, image, delete)
 *          capture(opts) → Promise({ image, w, h, photo?, materials: [names], swatches: [{ mime, data }] })
 *          setPhoto(dataURL | null)                   (web) show the photo behind the 3D view
 *          place(on)                                  (web) shrink the panel to a bar while placing on the photo
 *          save(base64, mime, filename), close() }
 */
(function () {
  'use strict';

  var CSS = [
    '.rd{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:14px;height:100%;min-height:0;font-size:13px;color:var(--ink,#24221f)}',
    '.rd-main{display:flex;flex-direction:column;gap:10px;min-height:0}',
    '.rd-view{position:relative;flex:1;min-height:240px;background:#1e1d1b;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center}',
    '.rd-view img{max-width:100%;max-height:100%;object-fit:contain;display:block}',
    '.rd-empty{color:#cfc8bb;text-align:center;padding:24px;line-height:1.5;max-width:420px}',
    '.rd-busy{position:absolute;inset:0;background:rgba(20,19,17,.62);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-weight:600}',
    '.rd-spin{width:38px;height:38px;border-radius:50%;border:4px solid rgba(255,255,255,.25);border-top-color:#fff;animation:rdspin 1s linear infinite}',
    '@keyframes rdspin{to{transform:rotate(360deg)}}',
    // the "workshop" while the AI works: covers the whole window, whatever mode it is in
    '.rd-wait{position:fixed;inset:0;z-index:9000;background:rgba(20,19,17,.78);display:flex;align-items:center;justify-content:center;padding:18px;animation:rdfade .2s}',
    '@keyframes rdfade{from{opacity:0}}',
    '.rd-wait-card{background:#fffaf2;color:#24221f;border-radius:18px;padding:26px 26px 20px;width:min(420px,100%);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.35);font:14px/1.45 -apple-system,"Segoe UI",Inter,Roboto,sans-serif}',
    '.rd-wait svg{width:120px;height:120px;display:block;margin:0 auto 6px;overflow:visible}',
    '.rd-wait .cab{animation:rdhop 1.4s ease-in-out infinite;transform-origin:60px 104px}',
    '@keyframes rdhop{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.06,.92)}40%{transform:translateY(-16px) scale(.96,1.05)}62%{transform:translateY(0) scale(1.05,.94)}75%{transform:scale(1)}}',
    '.rd-wait .door{transform-origin:34px 0;animation:rddoor 2.8s ease-in-out infinite}',
    '@keyframes rddoor{0%,45%,100%{transform:scaleX(1)}60%,85%{transform:scaleX(.18)}}',
    '.rd-wait .eye{animation:rdblink 3.2s infinite;transform-origin:center 52px;transform-box:fill-box}',
    '@keyframes rdblink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}',
    '.rd-wait .shadow{animation:rdshadow 1.4s ease-in-out infinite;transform-origin:60px 110px}',
    '@keyframes rdshadow{40%{transform:scaleX(.7);opacity:.35}}',
    '.rd-wait .spark{animation:rdspark 1.4s ease-out infinite;opacity:0}',
    '@keyframes rdspark{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-26px)}}',
    '.rd-wait h3{margin:4px 0 2px;font-size:17px}',
    '.rd-wait-msg{min-height:42px;margin:8px 0 12px;color:#4a463f;font-weight:600;transition:opacity .25s}.rd-wait-msg.out{opacity:0}',
    '.rd-wait-bar{height:6px;border-radius:9px;background:#ece5d8;overflow:hidden}.rd-wait-bar i{display:block;height:100%;width:0;background:var(--accent,#b5652e);border-radius:9px;transition:width 1s linear}',
    '.rd-wait-foot{display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:#7a746a}',
    '.rd-strip{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;min-height:84px;align-items:stretch}.rd-sep{flex:none;width:1px;background:var(--line,#d5d0c6);margin:4px 2px}',
    '.rd-ver{flex:none;width:112px;border:2px solid transparent;border-radius:9px;background:var(--soft,#f0ebe2);cursor:pointer;padding:0;overflow:hidden;text-align:left;font:inherit;color:inherit}',
    '.rd-ver.on{border-color:var(--accent,#b5652e)}',
    '.rd-ver .th{width:100%;height:62px;background:#d8d2c6 center/cover no-repeat;display:block}',
    '.rd-ver small{display:block;padding:3px 6px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.rd-side{display:flex;flex-direction:column;gap:10px;overflow-y:auto;min-height:0;padding-right:2px}',
    '.rd-card{border:1px solid var(--line,#e3dfd6);border-radius:10px;background:var(--panel,#fff);padding:10px 12px;display:grid;gap:8px}',
    '.rd-card h4{margin:0;font-size:13.5px}.rd-sub{color:var(--muted,#7a756c);font-size:12px}',
    '.rd-chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.rd-chips button{font:inherit;font-size:12px;padding:6px 9px;border-radius:16px;border:1px solid var(--line,#d5d0c6);background:#fff;cursor:pointer;color:inherit}',
    '.rd-chips button.on{background:var(--accent,#b5652e);border-color:var(--accent,#b5652e);color:#fff}',
    '.rd textarea{font:inherit;width:100%;box-sizing:border-box;min-height:58px;padding:7px 8px;border:1px solid var(--line,#d5d0c6);border-radius:8px;resize:vertical}',
    '.rd-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '.rd .rd-btn{font:inherit;font-weight:650;padding:8px 13px;border-radius:9px;border:1px solid var(--line,#d5d0c6);background:#fff;cursor:pointer;color:inherit}',
    '.rd .rd-btn.go{background:var(--accent,#b5652e);border-color:var(--accent,#b5652e);color:#fff}',
    '.rd .rd-btn:disabled{opacity:.5;cursor:default}.rd .rd-btn.small{padding:5px 9px;font-weight:600;font-size:12px}',
    '.rd select{font:inherit;padding:6px;border:1px solid var(--line,#d5d0c6);border-radius:8px;background:#fff;max-width:100%}',
    '.rd-err{color:#b3261e;font-weight:600;font-size:12px}',
    '.rd-place-bar{display:none}',
    '.rd{position:relative}.rd-x{position:absolute;top:-6px;right:-6px;width:34px;height:34px;border-radius:50%;border:1px solid var(--line,#d5d0c6);background:#fff;color:inherit;font-size:15px;line-height:1;cursor:pointer;z-index:3;box-shadow:0 2px 8px rgba(0,0,0,.12)}',
    '.rd-x:hover{background:#24221f;color:#fff;border-color:#24221f}.rd.placing .rd-x{display:none}',
    '.rd-side{padding-top:30px}',
    '.rd.placing{display:block;height:auto}.rd.placing>.rd-main,.rd.placing>.rd-side{display:none}',
    '.rd.placing .rd-place-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '@media (max-width:760px){.rd{grid-template-columns:1fr;height:auto}.rd-view{min-height:220px;max-height:52vh}.rd-side{overflow:visible}}'
  ].join('\n');

  var SCENE_LABEL = {
    model: 'As in my SketchUp model', studio: 'Product shot — white', studio_grey: 'Product shot — light grey', kitchen: 'Kitchen', bedroom: 'Bedroom', living: 'Living room', bathroom: 'Bathroom',
    office: 'Home office', music: 'Music studio', closet: 'Walk-in closet', photo: 'My photo of the room'
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function open(host, ctx) {
    var t = ctx.t;
    if (!document.getElementById('rd-css')) { var st = document.createElement('style'); st.id = 'rd-css'; st.textContent = CSS; document.head.appendChild(st); }
    var S = {
      status: null, renders: [], cur: null, v: 0, busy: '', err: '', imgs: {},
      scene: ctx.scene || (ctx.scenes || ['studio'])[0], notes: '', size: '2K', tweak: '', photo: null, placing: false
    };

    function key(rid, v) { return rid + ':' + v; }
    function img(rid, v) { return S.imgs[key(rid, v)] || null; }
    function load(rid, v) {
      if (img(rid, v) || S.imgs[key(rid, v) + ':loading']) { return; }
      S.imgs[key(rid, v) + ':loading'] = true;
      ctx.call('image', { rid: rid, v: v }).then(function (r) {
        S.imgs[key(rid, v)] = 'data:' + (r.mime || 'image/jpeg') + ';base64,' + r.data; draw();
      }, function () { delete S.imgs[key(rid, v) + ':loading']; });
    }
    function fail(e) { S.busy = ''; waitHide(); S.err = (e && (e.message || e.error)) || String(e); draw(); }
    function refreshStatus() { ctx.call('status', {}).then(function (r) { S.status = r; draw(); }, function (e) { S.err = (e && e.message) || ''; draw(); }); }

    function pick(r, v) {
      S.cur = r; S.v = v || (r.versions.length ? r.versions[r.versions.length - 1].v : 0); S.err = '';
      if (S.v) { load(r.id, S.v); }
      var n = 0;
      S.renders.forEach(function (rr) { rr.versions.slice().reverse().forEach(function (x) { if (n++ < 40) { load(rr.id, x.v); } }); });
      draw();
    }

    // ------------------------------------------------------------ the waiting room
    var JOKES = {
      render: ['Sanding the edges…', 'Convincing the sunlight to come in through the window…', 'Asking the wood to show off its best grain…',
        'Telling the furniture it is NOT a miniature. It took it well.', 'Measuring twice, rendering once…', 'Sweeping the sawdust under the rug…',
        'Adjusting the softboxes. A bit left. No, right. Perfect.', 'Hiring a very picky photographer…', 'Polishing the handles (no fingerprints, promise)…',
        'Waiting for the varnish to dry…', 'Shooing the cat out of the shot…', 'Straightening the pictures on the wall…',
        'Negotiating with the pixels. They want a raise.', 'Fluffing the cushions nobody will sit on…', 'Checking every door closes. Twice.',
        'Teaching the shadows where to sit…', 'Bribing the camera with coffee…', 'Almost there — the AI is on its last coat of paint…'],
      tweak: ['Reading your notes very carefully…', 'Moving the lamp. Moving it back. Moving it again…', 'The AI is squinting at your request…',
        'Repainting without touching the furniture (it bites)…', 'Asking the light to try a different mood…', 'Smudging out the old version, keeping it safe in the drawer…',
        'Polishing the handles (again)…', 'Bribing the camera with more coffee…', 'Almost there — just a last touch-up…']
    };
    var wait = null;
    function waitShow(kind, title) {
      waitHide();
      var list = JOKES[kind].slice(), t0 = Date.now(), k = 0;
      for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = list[i]; list[i] = list[j]; list[j] = x; }
      var el = document.createElement('div');
      el.className = 'rd-wait';
      el.innerHTML = '<div class="rd-wait-card" role="status" aria-live="polite">' +
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
          '<ellipse class="shadow" cx="60" cy="110" rx="34" ry="5" fill="#000" opacity=".15"/>' +
          '<g class="cab"><rect x="26" y="24" width="68" height="80" rx="4" fill="#c9a77c" stroke="#5b4630" stroke-width="3"/>' +
          '<rect x="22" y="18" width="76" height="9" rx="3" fill="#3a3632"/>' +
          '<rect x="60" y="30" width="28" height="68" rx="2" fill="#d9bd95" stroke="#5b4630" stroke-width="2.5"/>' +
          '<g transform="translate(32 30)"><rect class="door" x="0" y="0" width="28" height="68" rx="2" fill="#d9bd95" stroke="#5b4630" stroke-width="2.5"/></g>' +
          '<circle class="eye" cx="48" cy="52" r="3.4" fill="#24221f"/><circle class="eye" cx="72" cy="52" r="3.4" fill="#24221f"/>' +
          '<path d="M52 64q8 7 16 0" fill="none" stroke="#24221f" stroke-width="2.6" stroke-linecap="round"/>' +
          '<rect x="34" y="104" width="6" height="5" fill="#5b4630"/><rect x="80" y="104" width="6" height="5" fill="#5b4630"/></g>' +
          '<circle class="spark" cx="20" cy="40" r="3" fill="#f2c94c" style="--dx:-8px"/><circle class="spark" cx="100" cy="34" r="2.5" fill="#f2c94c" style="--dx:9px;animation-delay:.5s"/>' +
          '<circle class="spark" cx="104" cy="70" r="2" fill="#b5652e" style="--dx:6px;animation-delay:.9s"/></svg>' +
        '<h3>' + esc(title) + '</h3><div class="rd-wait-msg">' + esc(t(list[0])) + '</div>' +
        '<div class="rd-wait-bar"><i></i></div><div class="rd-wait-foot"><span class="sec">0 s</span><span>' + esc(t('Usually 20–60 seconds')) + '</span></div></div>';
      document.body.appendChild(el);
      var msg = el.querySelector('.rd-wait-msg'), bar = el.querySelector('.rd-wait-bar i'), sec = el.querySelector('.sec');
      wait = { el: el, timer: setInterval(function () {
        if (!host.isConnected) { waitHide(); return; }   // the window was closed: the picture still lands in the list
        var s = Math.round((Date.now() - t0) / 1000);
        sec.textContent = s + ' s';
        bar.style.width = Math.min(96, 100 * (1 - Math.exp(-s / 28))) + '%';
        if (s && s % 4 === 0) {
          msg.classList.add('out');
          setTimeout(function () { k = (k + 1) % list.length; msg.textContent = t(list[k]); msg.classList.remove('out'); }, 250);
        }
      }, 1000) };
    }
    function waitHide() { if (wait) { clearInterval(wait.timer); wait.el.remove(); wait = null; } }

    function render() {
      if (S.busy) { return; }   // one at a time: a second click does nothing
      S.err = '';
      if (S.scene === 'photo' && !S.photo) { S.err = t('Choose a photo of the room first.'); draw(); return; }
      S.busy = t('Capturing the view…'); draw();
      waitShow('render', t('Your picture is in the workshop'));
      ctx.capture({ scene: S.scene, photo: S.photo }).then(function (cap) {
        S.busy = t('Rendering… this takes 20–60 seconds'); draw();
        return ctx.call('new', {
          site: ctx.site, title: ctx.title, scene: S.scene, notes: S.notes, size: S.size, image: cap.image, w: cap.w, h: cap.h,
          photo: cap.photo || null, materials: cap.materials || [], swatches: cap.swatches || [], dims: cap.dims || null
        });
      }).then(function (r) {
        S.busy = ''; waitHide();
        S.imgs[key(r.rid, r.v)] = 'data:' + (r.mime || 'image/jpeg') + ';base64,' + r.image;
        S.renders.unshift(r.render); S.cur = r.render; S.v = r.v;
        if (S.status) { S.status.remaining = r.remaining; }
        S.placing = false; if (ctx.place) { ctx.place(false); }
        draw();
      }, fail);
    }

    function tweak() {
      var txt = S.tweak.trim();
      if (!txt || !S.cur || S.busy) { return; }
      S.err = ''; S.busy = t('Making the change… 20–60 seconds'); draw();
      waitShow('tweak', t('Making your change'));
      ctx.call('tweak', { rid: S.cur.id, from: S.v, text: txt }).then(function (r) {
        S.busy = ''; S.tweak = ''; waitHide();
        S.imgs[key(r.rid, r.v)] = 'data:' + (r.mime || 'image/jpeg') + ';base64,' + r.image;
        S.cur.versions.push(r.version); S.cur.updated = r.version.at; S.v = r.v;
        if (S.status) { S.status.remaining = r.remaining; }
        draw();
      }, fail);
    }

    function saveCur() {
      var u = S.cur && img(S.cur.id, S.v);
      if (!u) { return; }
      var m = /^data:([^;]+);base64,(.*)$/.exec(u);
      var name = (ctx.title || 'PanelPro').replace(/[^\w\- ]+/g, '').trim() + ' render v' + S.v + (m[1] === 'image/png' ? '.png' : '.jpg');
      ctx.save(m[2], m[1], name);
    }

    function verLabel(x) { return 'v' + x.v + (x.parent ? ' ← v' + x.parent : '') + (x.prompt ? ' · ' + x.prompt : ''); }

    function draw() {
      var y = host.scrollTop, cur = S.cur, u = cur && S.v ? img(cur.id, S.v) : null;
      var remaining = S.status ? S.status.remaining : null, allow4k = S.status && S.status.allow4k;
      var h = '<div class="rd' + (S.placing ? ' placing' : '') + '">' +
        '<div class="rd-place-bar"><b>' + esc(t('Move, turn and zoom the 3D view until the furniture sits where it goes in the photo.')) + '</b>' +
          '<button type="button" class="rd-btn go" data-act="render"' + (S.busy ? ' disabled' : '') + '>' + esc(t('Render')) + '</button>' +
          '<button type="button" class="rd-btn" data-act="unplace">' + esc(t('Back')) + '</button>' +
          (S.err ? '<div class="rd-err">' + esc(S.err) + '</div>' : '') + '</div>' +
        '<div class="rd-main"><div class="rd-view">' +
          (u ? '<img alt="" src="' + u + '">' : '<div class="rd-empty">' + esc(cur && S.v ? t('Loading…') : t('Pick a setting and press Render: the view as it is now becomes a photorealistic picture. Then tell the AI what to change — every version is kept.')) + '</div>') +
          (S.busy ? '<div class="rd-busy"><div class="rd-spin"></div><div>' + esc(S.busy) + '</div></div>' : '') +
        '</div>' +
        '<div class="rd-strip">' + S.renders.map(function (r, ri) {
          // every render of the project stays here (newest first), each with all its versions
          return (ri ? '<span class="rd-sep" aria-hidden="true"></span>' : '') + r.versions.slice().reverse().map(function (x) {
            var th = img(r.id, x.v), on = cur && cur.id === r.id && x.v === S.v;
            var lab = (S.renders.length > 1 ? '#' + (S.renders.length - ri) + ' ' : '') + verLabel(x);
            return '<button type="button" class="rd-ver' + (on ? ' on' : '') + '" data-rid="' + esc(r.id) + '" data-ver="' + x.v + '" title="' + esc(lab) + '"><span class="th"' + (th ? ' style="background-image:url(' + th + ')"' : '') + '></span><small>' + esc(lab) + '</small></button>';
          }).join('');
        }).join('') + '</div></div>' +
        '<div class="rd-side">' +
          (S.err ? '<div class="rd-err">' + esc(S.err) + '</div>' : '') +
          (cur ? '<div class="rd-card"><h4>' + esc(t('Change this picture')) + ' (v' + S.v + ')</h4>' +
            '<textarea id="rdTweak" placeholder="' + esc(t('e.g. warmer light, darker wood floor, add plants on the counter, open the curtains')) + '">' + esc(S.tweak) + '</textarea>' +
            '<div class="rd-row"><button type="button" class="rd-btn go" data-act="tweak"' + (S.busy ? ' disabled' : '') + '>' + esc(t('Make the change')) + '</button>' +
            '<button type="button" class="rd-btn" data-act="save"' + (u ? '' : ' disabled') + '>' + esc(t('Save image')) + '</button></div>' +
            '<div class="rd-sub">' + esc(t('A new version is made from the one picked below the picture; the others stay.')) + '</div></div>' : '') +
          '<div class="rd-card"><h4>' + esc(t('New render')) + '</h4>' +
            '<div class="rd-sub">' + esc(t('Setting')) + '</div><div class="rd-chips">' + (ctx.scenes || []).map(function (k) {
              return '<button type="button" data-scene="' + k + '" class="' + (S.scene === k ? 'on' : '') + '">' + esc(t(SCENE_LABEL[k] || k)) + '</button>';
            }).join('') + '</div>' +
            (S.scene === 'photo' ? '<div class="rd-row"><label class="rd-btn small" style="cursor:pointer">' + esc(t(S.photo ? 'Change photo' : 'Choose photo')) +
              '<input type="file" accept="image/*" id="rdPhoto" hidden></label>' + (S.photo ? '<button type="button" class="rd-btn small" data-act="place">' + esc(t('Place on the photo')) + '</button>' : '') + '</div>' : '') +
            (S.scene === 'model' ? '<div class="rd-sub">' + esc(t('The SketchUp view as it is now — walls, windows, doors and everything else in it come along. Tip: use SketchUp’s Match Photo to put the model in a photo of the room.')) + '</div>' : '') +
            '<textarea id="rdNotes" placeholder="' + esc(t('Anything else: wood floor, white walls, evening light, plants…')) + '">' + esc(S.notes) + '</textarea>' +
            '<div class="rd-row"><span class="rd-sub">' + esc(t('Size')) + '</span><div class="rd-chips">' + ['2K'].concat(allow4k ? ['4K'] : []).map(function (k) {
              return '<button type="button" data-size="' + k + '" class="' + (S.size === k ? 'on' : '') + '">' + k + '</button>';
            }).join('') + '</div></div>' +
            '<div class="rd-row"><button type="button" class="rd-btn go" data-act="render"' + (S.busy || remaining === 0 ? ' disabled' : '') + '>' + esc(t('Render')) + '</button>' +
            '<span class="rd-sub">' + (remaining == null ? '' : remaining > 50000 ? esc(t('Unlimited renders (developer account) — each one is paid from your Google AI credit')) : esc(t('Renders left this month')) + ': ' + remaining) + '</span></div></div>' +
          (cur ? '<div class="rd-card"><h4>' + esc(t('Renders of this project')) + ': ' + S.renders.length + '</h4>' +
            '<div class="rd-sub">' + esc(t('All of them are in the strip under the picture (newest first). This one') + ': ' + new Date(cur.created).toLocaleString(ctx.lang) + ' · ' + t(SCENE_LABEL[cur.scene] || cur.scene) + ' · ' + cur.versions.length + ' ' + t('versions')) + '</div>' +
            '<button type="button" class="rd-btn small" data-act="delete">' + esc(t('Delete this render and its versions')) + '</button></div>' : '') +
        '</div>' +
        '<button type="button" class="rd-x" data-act="close" aria-label="' + esc(t('Close')) + '" title="' + esc(t('Close')) + '">✕</button></div>';
      host.innerHTML = h;
      host.scrollTop = y;
      wire();
    }

    function wire() {
      var q = function (s) { return host.querySelector(s); };
      host.querySelectorAll('[data-scene]').forEach(function (b) {
        b.onclick = function () {
          S.scene = b.getAttribute('data-scene');
          if (S.scene !== 'photo' && ctx.setPhoto) { ctx.setPhoto(null); }
          else if (S.photo && ctx.setPhoto) { ctx.setPhoto(S.photo); }
          draw();
        };
      });
      host.querySelectorAll('[data-size]').forEach(function (b) { b.onclick = function () { S.size = b.getAttribute('data-size'); draw(); }; });
      host.querySelectorAll('[data-ver]').forEach(function (b) {
        b.onclick = function () {
          var r = S.renders.find(function (x) { return x.id === b.getAttribute('data-rid'); }) || S.cur;
          S.cur = r; S.v = +b.getAttribute('data-ver'); load(r.id, S.v); draw();
        };
      });
      var n = q('#rdNotes'); if (n) { n.oninput = function () { S.notes = n.value; }; }
      var tw = q('#rdTweak'); if (tw) { tw.oninput = function () { S.tweak = tw.value; }; tw.onkeydown = function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { tweak(); } }; }
      var ph = q('#rdPhoto');
      if (ph) {
        ph.onchange = function () {
          var f = ph.files && ph.files[0];
          if (!f) { return; }
          var rd = new FileReader();
          rd.onload = function () { S.photo = rd.result; if (ctx.setPhoto) { ctx.setPhoto(S.photo); } S.placing = true; if (ctx.place) { ctx.place(true); } draw(); };
          rd.readAsDataURL(f);
        };
      }
      var ls = q('#rdList');
      if (ls) { ls.onchange = function () { var r = S.renders.find(function (x) { return x.id === ls.value; }); if (r) { pick(r); } }; }
      host.querySelectorAll('[data-act]').forEach(function (b) {
        b.onclick = function () {
          var a = b.getAttribute('data-act');
          if (a === 'render') { render(); }
          else if (a === 'tweak') { tweak(); }
          else if (a === 'save') { saveCur(); }
          else if (a === 'place') { S.placing = true; if (ctx.place) { ctx.place(true); } draw(); }
          else if (a === 'unplace') { S.placing = false; if (ctx.place) { ctx.place(false); } draw(); }
          else if (a === 'close') { if (ctx.setPhoto) { ctx.setPhoto(null); } ctx.close(); }
          else if (a === 'delete' && S.cur) {
            var id = S.cur.id, sure = ctx.ask ? ctx.ask(t('Delete this render and all its versions?')) : Promise.resolve(window.confirm(t('Delete this render and all its versions?')));
            sure.then(function (ok) {
              if (!ok) { return; }
              ctx.call('delete', { rid: id }).then(function () {
                S.renders = S.renders.filter(function (r) { return r.id !== id; }); S.cur = null; S.v = 0;
                if (S.renders.length) { pick(S.renders[0]); } else { draw(); }
              }, fail);
            });
          }
        };
      });
    }

    draw();
    refreshStatus();
    ctx.call('list', { site: ctx.site }).then(function (r) {
      S.renders = r.renders || [];
      var st = ctx.start && S.renders.find(function (x) { return x.id === ctx.start.rid; });
      if (st) { pick(st, ctx.start.v); } else if (S.renders.length) { pick(S.renders[0]); } else { draw(); }
    }, function (e) { S.err = (e && e.message) || ''; draw(); });
  }

  window.PPRender = { open: open, SCENE_LABEL: SCENE_LABEL };
})();
