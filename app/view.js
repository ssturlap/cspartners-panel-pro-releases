/* PanelPro shared 3D view: the client's page (view only). ?s=<link>[&v=<version>]
 * Reads the shared model from the shareView function (cloud/functions/index.js) and draws it with
 * the same 3D view as the apps: turn, zoom, open / close doors and drawers, sizes on / off. */
(function () {
  'use strict';
  var ES = /^es\b/i.test(navigator.language || '');
  var TX = {
    'Loading the 3D view…': 'Cargando la vista 3D…', 'This link is no longer shared.': 'Este enlace ya no está compartido.', 'No such link.': 'Este enlace no existe.',
    'Could not open this link.': 'No se pudo abrir este enlace.', 'Open doors': 'Abrir puertas', 'Close doors': 'Cerrar puertas', 'Open drawers': 'Abrir gavetas',
    'Close drawers': 'Cerrar gavetas', 'Sizes': 'Medidas', 'Front': 'Frente', 'Fit': 'Ajustar', 'Overall size': 'Medidas generales', 'Width': 'Ancho', 'Height': 'Alto',
    'Depth': 'Fondo', 'Materials': 'Materiales', 'Renders': 'Imágenes', 'Version': 'Versión', 'latest': 'la más reciente', 'Drag to turn · pinch or scroll to zoom': 'Arrastre para girar · pellizque o use la rueda para acercar',
    'Prepared for': 'Preparado para', 'Melamine': 'Melamina', 'Plywood': 'Contrachapado', '3D view': 'Vista 3D', 'Composition': 'Composición', 'Module': 'Módulo'
  };
  function t(s) { return ES && TX[s] ? TX[s] : s; }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var ICON = {
    door: '<rect x="4" y="3.5" width="10" height="17" rx="1"/><path d="M14 4.5l6 2v13l-6-1.5M11 12h.01"/>',
    drawer: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 12h18M10 8.5h4M10 15.5h4"/>',
    sizes: '<path d="M3.5 15.5 15.5 3.5l5 5-12 12z"/><path d="M7.5 11.5l2 2M10.5 8.5l2 2M13.5 5.5l2 2"/>',
    front: '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 12h16"/>',
    fit: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'
  };
  var q = new URLSearchParams(location.search), sid = q.get('s') || '', want = q.get('v');
  var fb = window.PP_FIREBASE || {}, API = 'https://us-central1-' + (fb.projectId || 'panelpro-bf92e') + '.cloudfunctions.net/shareView';
  $('vMsgT').textContent = t('Loading the 3D view…');
  $('vHint').textContent = t('Drag to turn · pinch or scroll to zoom');
  document.documentElement.lang = ES ? 'es' : 'en';
  function fail(msg) { $('vMsg').innerHTML = '<b>' + esc(t(msg)) + '</b>'; $('vMsg').hidden = false; }

  var D = null, ready = false, units = { k: 1, name: 'mm' };
  function fmt(v) { return String(Math.round(v / units.k * 10) / 10) + ' ' + units.name; }
  function load(v) {
    $('vMsg').hidden = false;
    fetch(API + '?s=' + encodeURIComponent(sid) + (v ? '&v=' + encodeURIComponent(v) : '')).then(function (r) {
      return r.json().then(function (j) { if (!r.ok) { throw new Error(j.error || 'Could not open this link.'); } return j; });
    }).then(show, function (e) { fail(e.message || 'Could not open this link.'); });
  }
  function show(d) {
    D = d;
    var m = d.model || {};
    units = m.units === 'cm' ? { k: 10, name: 'cm' } : { k: 1, name: 'mm' };
    document.title = (d.title || t('3D view')) + (d.brand && d.brand.name ? ' — ' + d.brand.name : '');
    $('vTitle').textContent = d.title || t('3D view');
    $('vSub').textContent = [d.client ? t('Prepared for') + ' ' + d.client : '', new Date(d.at).toLocaleDateString(ES ? 'es' : 'en', { dateStyle: 'medium' })].filter(Boolean).join(' · ');
    $('vBrand').innerHTML = d.brand ? (d.brand.logo ? '<img alt="' + esc(d.brand.name) + '" src="' + esc(d.brand.logo) + '">' : '') + (d.brand.name ? '<span>' + esc(d.brand.name) + '</span>' : '') : '';
    var sel = $('vVer');
    sel.hidden = (d.versions || []).length < 2;
    sel.innerHTML = (d.versions || []).map(function (x, i) {
      return '<option value="' + x.v + '"' + (x.v === d.v ? ' selected' : '') + '>' + t('Version') + ' ' + x.v + ' · ' +
        new Date(x.at).toLocaleDateString(ES ? 'es' : 'en', { dateStyle: 'medium' }) + (i === 0 ? ' (' + t('latest') + ')' : '') + '</option>';
    }).join('');
    sel.onchange = function () { load(this.value); };
    draw(m);
    side(d, m);
  }
  function matFn(m) {
    var mats = m.mats || {};
    return function (n) { return mats[n] || { color: '#d8d2c4', alpha: 1 }; };
  }
  function draw(m) {
    var P3D = window.P3D;
    if (!P3D || !P3D.ok) { fail('Could not open this link.'); return; }
    if (!ready) { P3D.init($('stage')); ready = true; window.addEventListener('resize', function () { P3D.resize(); }); }
    var urls = Object.keys(m.mats || {}).map(function (k) { return m.mats[k].thumb; }).filter(Boolean);
    P3D.loadTex(urls, function () {
      P3D.setDimUnits(units.k, units.name);
      P3D.setSoft(m.soft !== false);
      P3D.setHeights(m.rows || []);
      P3D.update(m.parts || [], matFn(m), m.movers || [], m.places || null);
      $('vMsg').hidden = true;
      tools(m);
      // frame it once the page has its final layout
      requestAnimationFrame(function () { P3D.resize(); P3D.reset('iso'); });
    });
  }
  function tools(m) {
    var P3D = window.P3D, n = { door: 0, drawer: 0 };
    (m.movers || []).forEach(function (x) { n[x.kind] = (n[x.kind] || 0) + 1; });
    var h = '';
    if (n.door) { h += btn('door', 'door', P3D.isOpen('door') ? t('Close doors') : t('Open doors')); }
    if (n.drawer) { h += btn('drawer', 'drawer', P3D.isOpen('drawer') ? t('Close drawers') : t('Open drawers')); }
    h += btn('sizes', 'sizes', t('Sizes'), P3D.dimsOn()) + btn('front', 'front', t('Front')) + btn('fit', 'fit', t('Fit'));
    var box = $('vTools');
    box.innerHTML = h;
    box.querySelectorAll('.tool').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-a');
        if (a === 'door' || a === 'drawer') { P3D.toggle(a); setTimeout(function () { tools(m); }, 50); }
        else if (a === 'sizes') { P3D.setDims(!P3D.dimsOn()); P3D.zoomExtents(); tools(m); }
        else if (a === 'front') { P3D.reset('front'); }
        else { P3D.reset('iso'); }
      };
    });
  }
  function btn(a, icon, label, pressed) {
    return '<button type="button" class="tool" data-a="' + a + '"' + (pressed != null ? ' aria-pressed="' + !!pressed + '"' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[icon] + '</svg>' + esc(label) + '</button>';
  }
  var TYPE = { melamine: 'Melamine', mdf: 'MDF', plywood: 'Plywood' };
  function side(d, m) {
    var h = '';
    if (m.dims) {
      h += '<div class="card"><h2>' + t('Overall size') + '</h2><div class="dims"><div><small>' + t('Width') + '</small><b>' + fmt(m.dims.w) + '</b></div>' +
        '<div><small>' + t('Height') + '</small><b>' + fmt(m.dims.h) + '</b></div><div><small>' + t('Depth') + '</small><b>' + fmt(m.dims.d) + '</b></div></div></div>';
    }
    // the boards in view (not metal, glass, the mattress…)
    var used = {};
    (m.parts || []).forEach(function (p) { if (p.mat && p.cut !== false && p.role !== 'hardware' && !p.deco) { used[p.mat] = (used[p.mat] || 0) + 1; } });
    var names = Object.keys(used).sort(function (a, b) { return used[b] - used[a]; });
    if (names.length) {
      h += '<div class="card"><h2>' + t('Materials') + '</h2>' + names.map(function (n) {
        var x = (m.mats || {})[n] || {}, brand = x.brand || '', label = x.label || n.replace(/^PanelPro /, '');
        if (brand && label.toUpperCase().indexOf(brand.toUpperCase() + ' ') === 0) { label = label.slice(brand.length + 1); }
        var bg = 'background-color:' + esc(x.avg || x.color || '#ddd') + (x.thumb ? ';background-image:url(\'' + esc(x.thumb) + '\')' : '');
        return '<div class="mat"><span class="sw" style="' + bg + '"></span><div>' + (brand ? '<small>' + esc(brand) + '</small>' : '') + '<b>' + esc(label) + '</b>' +
          (x.type ? '<span>' + esc(t(TYPE[x.type] || x.type)) + '</span>' : '') + '</div></div>';
      }).join('') + '</div>';
    }
    var pics = [];
    (d.renders || []).forEach(function (r) { (r.versions || []).slice().reverse().forEach(function (v) { pics.push({ rid: r.rid, v: v.v }); }); });
    if (pics.length) {
      h += '<div class="card"><h2>' + t('Renders') + '</h2><div class="rends">' + pics.map(function (p) {
        var u = API + '?s=' + encodeURIComponent(sid) + '&rid=' + encodeURIComponent(p.rid) + '&rv=' + p.v;
        return '<button type="button" data-u="' + esc(u) + '"><img loading="lazy" alt="" src="' + esc(u) + '"></button>';
      }).join('') + '</div></div>';
    }
    $('vSide').innerHTML = h;
    $('vSide').querySelectorAll('.rends button').forEach(function (b) {
      b.onclick = function () { var lb = $('vLb'); lb.querySelector('img').src = b.getAttribute('data-u'); lb.hidden = false; };
    });
  }
  $('vLb').onclick = function (e) { if (e.target === this || e.target.classList.contains('lb-x')) { this.hidden = true; } };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $('vLb').hidden = true; } });
  if (!sid) { fail('No such link.'); } else { load(want); }
})();
