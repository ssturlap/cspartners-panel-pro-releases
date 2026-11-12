/* PanelPro Web — material list (interface + storage; the costing itself is core/costing.rb).
 *
 * One entry per decor: name (the same text typed in a module's material boxes), texture image,
 * sheet size, and per thickness: price per sheet, edge tape roll price and roll length.
 * The list lives on this phone (localStorage); texture images in IndexedDB (too big for
 * localStorage). Export / import moves the list, images included, to another phone.
 */
(function () {
  'use strict';
  var A = window.PPApp;
  var KEY = 'panelpro.web.materials.v1';
  var FORMAT = 'panelpro_materials';
  var DB = { name: 'panelpro-web', store: 'tex' };

  var ES = {
    'Materials': 'Materiales', 'Material list': 'Lista de materiales', 'New material': 'Material nuevo',
    'No materials yet': 'Aún no hay materiales',
    'Add the boards you buy: texture, sheet size, thicknesses, price per sheet and edge tape rolls. Type the same name in a module’s material boxes to use it.':
      'Agregue los tableros que compra: textura, tamaño, espesores, precio por tablero y rollos de canto. Escriba el mismo nombre en los materiales de un módulo para usarlo.',
    'Brand': 'Marca', 'Texture': 'Textura', 'Choose image': 'Elegir imagen', 'Change image': 'Cambiar imagen', 'Remove image': 'Quitar imagen',
    'Colour': 'Color', 'Sheet': 'Tablero', 'Sheet length': 'Largo del tablero', 'Sheet width': 'Ancho del tablero',
    'Image covers (along the grain)': 'La imagen cubre (a lo largo de la veta)', 'Image covers (across)': 'La imagen cubre (a lo ancho)',
    'Thicknesses': 'Espesores', 'Thickness': 'Espesor', '+ Thickness': '+ Espesor', 'Price per sheet': 'Precio por tablero',
    'Edge tape roll price': 'Precio del rollo de canto', 'Roll length': 'Largo del rollo',
    'Edge tape is costed in whole rolls: 1 m over a roll buys another roll.': 'El canto se cuesta en rollos completos: 1 m más que un rollo compra otro rollo.',
    'Delete material': 'Eliminar material', 'Delete this material?': '¿Eliminar este material?',
    'Export materials…': 'Exportar materiales…', 'Import materials…': 'Importar materiales…',
    'Default edge tape roll': 'Rollo de canto por defecto',
    'For materials or thicknesses with no roll in the list.': 'Para materiales o espesores sin rollo en la lista.',
    'Imported materials: ': 'Materiales importados: ', 'This file is not a PanelPro materials file.': 'Este archivo no es un archivo de materiales de PanelPro.',
    'Could not read this image.': 'No se pudo leer esta imagen.', 'Could not save the image on this phone.': 'No se pudo guardar la imagen en este teléfono.',
    'Same name as another material': 'Mismo nombre que otro material', 'no price': 'sin precio', 'Edit material': 'Editar material',
    'roll': 'rollo', 'rolls': 'rollos', 'uses': 'usa', 'left': 'sobran', 'no roll length set': 'sin largo de rollo',
    'Add to the material list': 'Agregar a la lista de materiales',
    'Used in modules by name. Change it here and in the modules together.': 'Los módulos lo usan por el nombre. Si lo cambia aquí, cámbielo también en los módulos.',
    'PanelPro catalog': 'Catálogo PanelPro', 'Search': 'Buscar', 'All': 'Todos', 'Other': 'Otro', 'Add': 'Agregar', 'In your list': 'En su lista',
    'Add all shown': 'Agregar todos los mostrados', 'materials': 'materiales', 'Added to your list': 'Agregado a su lista', 'Added: ': 'Agregados: ',
    'The boards of the PanelPro catalog (EGGER, BERNECK, ARKOPA, CLEAF, ONESKIN). Modules can use them by name even without adding them; add them to your list to set your prices.':
      'Los tableros del catálogo PanelPro (EGGER, BERNECK, ARKOPA, CLEAF, ONESKIN). Los módulos los pueden usar por el nombre aunque no los agregue; agréguelos a su lista para poner sus precios.',
    'Melamine / MDP': 'Melamina / MDP', 'MDF': 'MDF', 'Plywood / wood': 'Triplay / Madera', 'Board type': 'Tipo de tablero',
    'Notes': 'Notas', 'Has grain': 'Tiene veta (grano)', 'Wood patterns: parts follow the grain of the sheet.': 'Materiales con patrón de madera: las piezas siguen la veta del tablero.',
    'Default material': 'Material por defecto', 'New modules start with it (carcass).': 'Los módulos nuevos empiezan con él (caja).',
    'Edge banding work per metre': 'Aplicación de canto por metro', 'Edge banding work': 'Aplicación de canto', 'in the edge tape total': 'incluido en el canto',
    'Could not load the catalog.': 'No se pudo cargar el catálogo.', 'No match.': 'Sin resultados.'
  };
  function t(s) { return A.lang() === 'es' && ES[s] ? ES[s] : A.t(s); }
  var esc = A.esc, fmt = A.fmt;

  // ------------------------------------------------------------------ storage
  var data = { list: [], tape: { roll_price: 0, roll_m: 0 } };
  var TEX = {}; // id → data URL
  var stamp = 0;  // changes whenever the list changes (cutting plan cache)
  function loadList() {
    var d = A.loadPref(KEY, null);
    if (d && Array.isArray(d.list)) { data = d; }
    data.tape = data.tape || { roll_price: 0, roll_m: 0 };
  }
  function cloud() { return window.PPCloud && window.PPCloud.on ? window.PPCloud : null; }
  function saveList() {
    stamp++;
    data.list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (cloud()) { cloud().materialsChanged(data.list); cloud().prefsChanged(A.prefs()); }
    else if (!A.savePref(KEY, data)) { A.toast(A.t('Could not save the site on this phone.')); }
    fillDatalist();
  }

  var dbp = null;
  function db() {
    if (dbp) { return dbp; }
    dbp = new Promise(function (ok, bad) {
      if (!window.indexedDB) { bad(new Error('no IndexedDB')); return; }
      var r = indexedDB.open(DB.name, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(DB.store); };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { bad(r.error); };
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (ok, bad) {
        var x = d.transaction(DB.store, mode), st = x.objectStore(DB.store), out = fn(st);
        x.oncomplete = function () { ok(out && out.result); };
        x.onerror = function () { bad(x.error); };
      });
    });
  }
  function texPut(id, url) {
    TEX[id] = url; stamp++;
    if (cloud()) { return cloud().texturePut(id, url); }
    return tx('readwrite', function (st) { st.put(url, id); });
  }
  function texDel(id) {
    delete TEX[id]; stamp++;
    if (cloud()) { return cloud().textureDel(id); }
    return tx('readwrite', function (st) { st.delete(id); }).catch(function () {});
  }
  function texLoadAll() {
    return tx('readonly', function (st) {
      var req = st.openCursor();
      req.onsuccess = function () { var c = req.result; if (c) { TEX[c.key] = c.value; c.continue(); } };
    }).catch(function () {});
  }

  // ------------------------------------------------------------------ PanelPro catalog (web/catalog, tools/catalog_build.py)
  // Shared boards, no prices: textures and sheet sizes for any module that names them, and the
  // starting point of everyone's own list.
  var CAT = null, catByKey = {}, catP = null;
  function loadCatalog() {
    if (catP) { return catP; }
    catP = fetch('catalog/materials.json').then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); }).then(function (d) {
      CAT = (d && d.materials) || [];
      catByKey = {};
      CAT.forEach(function (c) { catByKey[keyOf(c.material)] = c; });
      stamp++; fillDatalist();
      return CAT;
    }, function (e) { catP = null; CAT = CAT || []; throw e; });
    return catP;
  }
  function catFind(name) { return catByKey[keyOf(name)] || null; }
  function catTex(c) {   // the image covers 1200 mm along the grain (as the plugin's library)
    var px = c.tex_px || [1000, 1000];
    return { w: 1200, h: Math.round(1200 * px[1] / px[0]) };
  }

  // ------------------------------------------------------------------ lookups (used by the module screens)
  function keyOf(n) { return String(n || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function find(name) {
    var k = keyOf(name);
    if (!k) { return null; }
    for (var i = 0; i < data.list.length; i++) { if (keyOf(data.list[i].name) === k) { return data.list[i]; } }
    return null;
  }
  function byId(id) { return data.list.find(function (e) { return e.id === id; }) || null; }
  // 3D colour / texture for a material name, or null when it isn't in the list.
  function info(name) {
    var e = find(name);
    if (!e) {
      var c = catFind(name);
      if (!c) { return null; }
      var tx = catTex(c);
      return c.tex ? { color: '#ffffff', alpha: 1, thumb: c.tex, tex_w: tx.w, tex_h: tx.h } : { color: c.color || '#d8d2c4', alpha: 1 };
    }
    var url = TEX[e.id];
    if (url) { return { color: '#ffffff', alpha: 1, thumb: url, tex_w: e.tex_w || e.sheet_l || 2440, tex_h: e.tex_h || e.sheet_w || 1220 }; }
    return { color: e.color || '#d8d2c4', alpha: 1 };
  }
  // What the engine needs (no images).
  function engineList() {
    var out = data.list.map(function (e) {
      return { name: e.name, sheet_l: e.sheet_l || 0, sheet_w: e.sheet_w || 0, thick: e.thick || [] };
    });
    (CAT || []).forEach(function (c) {   // catalog boards not in the list: their sheet size (no prices)
      if (!find(c.material)) { out.push({ name: c.material, sheet_l: c.sheet_l, sheet_w: c.sheet_w, thick: c.thick.map(function (t) { return { t: t }; }) }); }
    });
    return out;
  }
  function costDefaults(prices) { return { roll_price: data.tape.roll_price || 0, roll_m: data.tape.roll_m || 0, prices: prices || {} }; }
  // Price per sheet typed on the cutting plan: kept in the list (adds the material / thickness).
  function setPrice(name, T, price) {
    var e = find(name) || addEntry(name);
    var th = thick(e, T, true);
    th.price = price;
    e.updated = new Date().toISOString();
    saveList();
    return e;
  }
  function thick(e, T, create) {
    e.thick = e.thick || [];
    var th = e.thick.find(function (x) { return Math.abs(Number(x.t) - Number(T)) < 0.01; });
    if (!th && create) { th = { t: Number(T), price: 0, roll_price: 0, roll_m: 0 }; e.thick.push(th); e.thick.sort(function (a, b) { return a.t - b.t; }); }
    return th || null;
  }
  function addEntry(name) {
    var e = { id: A.uid(), name: String(name || '').trim() || t('New material'), brand: '', color: '#d8d2c4',
              sheet_l: A.prefsOpt().sheet_l || 2440, sheet_w: A.prefsOpt().sheet_w || 1220, tex_w: 0, tex_h: 0,
              thick: [], updated: new Date().toISOString() };
    data.list.push(e);
    saveList();
    return e;
  }

  // Suggestions for the material boxes in the module editor.
  function fillDatalist() {
    var dl = document.getElementById('ppMatList');
    if (!dl) { dl = document.createElement('datalist'); dl.id = 'ppMatList'; document.body.appendChild(dl); }
    var opts = data.list.map(function (e) { return '<option value="' + esc(e.name) + '">' + esc(e.brand || '') + '</option>'; });
    (CAT || []).forEach(function (c) { if (!find(c.material)) { opts.push('<option value="' + esc(c.material) + '">' + esc(t('PanelPro catalog')) + '</option>'); } });
    dl.innerHTML = opts.join('');
  }
  // CSS background for a swatch (texture image or colour).
  function swatchCss(name, fallback) {
    var e = find(name);
    if (e && TEX[e.id]) { return 'background:#ccc url(' + TEX[e.id] + ') center/cover'; }
    if (!e) { var c = catFind(name); if (c) { return c.tex ? 'background:#ccc url(' + (c.thumb || c.tex) + ') center/cover' : 'background:' + (c.color || fallback || '#ddd'); } }
    return 'background:' + ((e && e.color) || fallback || '#ddd');
  }

  // ------------------------------------------------------------------ images
  // Phone photos are big: scale to 1024 px and JPEG, enough for the 3D view.
  function readImage(file) {
    return new Promise(function (ok, bad) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var s = Math.min(1, 1024 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = function () { URL.revokeObjectURL(url); bad(new Error('image')); };
      img.src = url;
    });
  }
  function pickImage(done) {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = function () { if (inp.files[0]) { done(inp.files[0]); } };
    inp.click();
  }

  // ------------------------------------------------------------------ screens
  function money(v) { return (A.prefsOpt().currency || '') + ' ' + fmt(v || 0); }
  function len(v) { return A.LU(v); }
  function thicksTxt(e) {
    return (e.thick || []).map(function (x) { return fmt(x.t) + ' mm' + (x.price ? ' · ' + money(x.price) : ''); }).join('  |  ');
  }

  function renderList() {
    A.show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button><h1>' + esc(t('Materials')) + '</h1>' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(A.t('More')) + '">⋯</button></header>' +
      '<div class="page page-wide">' + tabs('mine') +
      (data.list.length ? '<div class="list">' + data.list.map(function (e) {
        return '<button type="button" class="row-card" data-mat="' + esc(e.id) + '"><i class="mat-thumb" style="' + esc(swatchCss(e.name)) + '"></i>' +
          '<span class="grow"><span class="t1">' + esc(e.name) + (e.brand ? ' <small class="muted">' + esc(e.brand) + '</small>' : '') + '</span>' +
          '<span class="t2">' + esc(len(e.sheet_l) + ' × ' + len(e.sheet_w)) + (thicksTxt(e) ? ' · ' + esc(thicksTxt(e)) : '') + '</span></span>' +
          '<span class="chev" aria-hidden="true">›</span></button>';
      }).join('') + '</div>'
        : '<div class="empty"><h2>' + esc(t('No materials yet')) + '</h2><p>' + esc(t('Add the boards you buy: texture, sheet size, thicknesses, price per sheet and edge tape rolls. Type the same name in a module’s material boxes to use it.')) + '</p></div>') +
      '<div class="box fields" style="margin-top:16px"><h3 class="grp">' + esc(t('Default edge tape roll')) + '</h3>' +
        '<p class="meta-line">' + esc(t('For materials or thicknesses with no roll in the list.')) + ' ' + esc(t('Edge tape is costed in whole rolls: 1 m over a roll buys another roll.')) + '</p>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Edge tape roll price')) + '</span><button type="button" class="valbtn" data-tape="roll_price">' + esc(money(data.tape.roll_price)) + '</button></div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Roll length')) + '</span><button type="button" class="valbtn" data-tape="roll_m">' + esc(fmt(data.tape.roll_m || 0) + ' m') + '</button></div></div>' +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="newMat">' + esc(t('New material')) + '</button></div>'
    );
    document.getElementById('back').onclick = function () { history.back(); };
    document.getElementById('newMat').onclick = function () {
      var e = addEntry('');
      e.name = ''; e.thick.push({ t: 18, price: 0, roll_price: 0, roll_m: 0 }); saveList();
      A.go('#/materials/' + encodeURIComponent(e.id));
    };
    document.querySelectorAll('[data-mat]').forEach(function (b) {
      b.onclick = function () { A.go('#/materials/' + encodeURIComponent(b.getAttribute('data-mat'))); };
    });
    document.querySelectorAll('[data-tape]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-tape');
        A.openPad({ label: t(k === 'roll_m' ? 'Roll length' : 'Edge tape roll price'), value: data.tape[k] || 0, allowZero: true,
                    unit: k === 'roll_m' ? 'm' : (A.prefsOpt().currency || '$'), done: function (v) { data.tape[k] = v; saveList(); renderList(); } });
      };
    });
    document.getElementById('moreBtn').onclick = function () {
      A.menu(null, [
        { label: t('Export materials…'), icon: 'download', run: exportList },
        readOnly() ? null : { label: t('Import materials…'), icon: 'upload', run: function () { A.pickFile(importList); } }
      ].filter(Boolean));
    };
    wireTabs();
    lockIfReadOnly();
  }

  // ------------------------------------------------------------------ account features (cloud.js)
  // Company members see the company list; only admins change it.
  function readOnly() { return !!(cloud() && !cloud().canEdit()); }
  function lockIfReadOnly() {
    if (!readOnly()) { return; }
    var page = document.querySelector('.page');
    page.insertAdjacentHTML('afterbegin', '<p class="warn-line">' + esc(cloud().t('Only admins change company materials and settings.')) + '</p>');
    page.querySelectorAll('.valbtn, .xbtn, input, textarea, select, #mImg, #mImgDel, #mAddT, #mDel, #mShare').forEach(function (el) { el.disabled = true; });
    var nm = document.getElementById('newMat'); if (nm) { nm.disabled = true; }
  }
  function tabs(on) {
    return '<div class="seg mat-tabs"><button type="button" data-mt="mine" class="' + (on === 'mine' ? 'on' : '') + '">' + esc(cloud() ? cloud().t('My list') : t('Material list')) + '</button>' +
      '<button type="button" data-mt="cat" class="' + (on === 'cat' ? 'on' : '') + '">' + esc(t('PanelPro catalog')) + '</button>' +
      (cloud() ? '<button type="button" data-mt="gal" class="' + (on === 'gal' ? 'on' : '') + '">' + esc(cloud().t('Public gallery')) + '</button>' : '') + '</div>';
  }
  function wireTabs() {
    document.querySelectorAll('[data-mt]').forEach(function (b) {
      b.onclick = function () { var k = b.getAttribute('data-mt'); A.go('#/materials' + (k === 'gal' ? '/gallery' : k === 'cat' ? '/catalog' : ''), true); };
    });
  }

  // ------------------------------------------------------------------ the PanelPro catalog screen
  var catQ = { q: '', brand: '', type: '' };
  function addFromCatalog(c) {
    var e = addEntry(c.material), tx = catTex(c);
    Object.assign(e, { brand: c.brand || '', type: c.type || 'melamine', color: c.color || e.color, sheet_l: c.sheet_l, sheet_w: c.sheet_w,
                       tex_w: c.tex ? tx.w : 0, tex_h: c.tex ? tx.h : 0, grain: c.grain !== false, notes: c.notes || '', catalog: c.id,
                       thick: c.thick.map(function (x) { return { t: Number(x), price: 0, roll_price: 0, roll_m: 0 }; }) });
    return (c.tex ? texPut(e.id, c.tex) : Promise.resolve()).catch(function () {}).then(function () { return e; });
  }
  function catShown() {
    var q = keyOf(catQ.q);
    return (CAT || []).filter(function (c) {
      if (catQ.brand && (c.brand || 'Other') !== catQ.brand) { return false; }
      if (catQ.type && c.type !== catQ.type) { return false; }
      return !q || keyOf(c.material + ' ' + (c.notes || '') + ' ' + t(TYPE_L[c.type] || '')).indexOf(q) >= 0;
    });
  }
  var TYPE_L = { melamine: 'Melamine / MDP', mdf: 'MDF', plywood: 'Plywood / wood' };
  function renderCatalog() {
    A.show('<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button><h1>' + esc(t('Materials')) + '</h1></header>' +
      '<div class="page page-wide">' + tabs('cat') + '<p class="meta-line">' + esc(t('The boards of the PanelPro catalog (EGGER, BERNECK, ARKOPA, CLEAF, ONESKIN). Modules can use them by name even without adding them; add them to your list to set your prices.')) + '</p>' +
      '<div class="box cat-filters"><input class="text-in" id="catQ" type="search" placeholder="' + esc(t('Search')) + '" value="' + esc(catQ.q) + '"><div id="catF"></div></div>' +
      '<div class="cat-head"><span id="catN" class="meta-line"></span><button type="button" class="btn small" id="catAll">' + esc(t('Add all shown')) + '</button></div>' +
      '<div class="cat-grid" id="catGrid"><p class="meta-line">…</p></div></div>');
    document.getElementById('back').onclick = function () { history.back(); };
    wireTabs();
    loadCatalog().then(draw, function () { document.getElementById('catGrid').innerHTML = '<p class="warn-line">' + esc(t('Could not load the catalog.')) + '</p>'; });
    var tmr = null;
    document.getElementById('catQ').oninput = function () { var v = this.value; clearTimeout(tmr); tmr = setTimeout(function () { catQ.q = v; draw(); }, 200); };
    function chips(key, list) {
      return '<div class="seg cat-seg">' + [['', t('All')]].concat(list).map(function (o) {
        return '<button type="button" data-cf="' + key + '" data-v="' + esc(o[0]) + '" class="' + (catQ[key] === o[0] ? 'on' : '') + '">' + esc(o[1]) + '</button>';
      }).join('') + '</div>';
    }
    function draw() {
      var brands = [];
      CAT.forEach(function (c) { var b = c.brand || 'Other'; if (brands.indexOf(b) < 0) { brands.push(b); } });
      document.getElementById('catF').innerHTML = chips('brand', brands.map(function (b) { return [b, b === 'Other' ? t('Other') : b]; })) +
        chips('type', Object.keys(TYPE_L).filter(function (k) { return CAT.some(function (c) { return c.type === k; }); }).map(function (k) { return [k, t(TYPE_L[k])]; }));
      document.querySelectorAll('[data-cf]').forEach(function (b) { b.onclick = function () { catQ[b.getAttribute('data-cf')] = b.getAttribute('data-v'); draw(); }; });
      var list = catShown(), ro = readOnly();
      document.getElementById('catN').textContent = list.length + ' ' + t('materials');
      document.getElementById('catAll').disabled = ro || !list.some(function (c) { return !find(c.material); });
      document.getElementById('catGrid').innerHTML = list.length ? list.map(function (c) {
        var have = !!find(c.material);
        return '<div class="cat-card"><i class="cat-img" style="' + esc(c.tex ? 'background:#ccc url(' + (c.thumb || c.tex) + ') center/cover' : 'background:' + c.color) + '"></i>' +
          '<div class="cat-txt"><small>' + esc(c.brand || t('Other')) + '</small><b>' + esc(c.name) + '</b>' +
          '<span>' + esc(len(c.sheet_l) + ' × ' + len(c.sheet_w) + ' · ' + c.thick.map(function (x) { return fmt(x) + ' mm'; }).join(', ')) + '</span>' +
          '<span>' + esc(t(TYPE_L[c.type] || '')) + '</span></div>' +
          (have ? '<span class="cat-have">✓ ' + esc(t('In your list')) + '</span>' : ro ? '' : '<button type="button" class="btn small" data-cadd="' + esc(c.id) + '">' + esc(t('Add')) + '</button>') + '</div>';
      }).join('') : '<p class="meta-line">' + esc(t('No match.')) + '</p>';
      document.querySelectorAll('[data-cadd]').forEach(function (b) {
        b.onclick = function () { var c = CAT.find(function (x) { return x.id === b.getAttribute('data-cadd'); }); addFromCatalog(c).then(function () { saveList(); A.toast(t('Added to your list')); draw(); }); };
      });
      document.getElementById('catAll').onclick = function () {
        var todo = catShown().filter(function (c) { return !find(c.material); });
        Promise.all(todo.map(addFromCatalog)).then(function () { saveList(); A.toast(t('Added: ') + todo.length); draw(); });
      };
    }
  }
  function renderGallery() {
    var G = cloud();
    A.show('<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button><h1>' + esc(t('Materials')) + '</h1></header>' +
      '<div class="page page-wide">' + tabs('gal') + '<p class="meta-line">' + esc(G.t('Prices stay private: only the texture, sheet size and thicknesses are shared.')) + '</p><div class="list" id="galList"><p class="meta-line">…</p></div></div>');
    document.getElementById('back').onclick = function () { history.back(); };
    wireTabs();
    G.gallery.load('materials').then(function (list) {
      var el = document.getElementById('galList'); if (!el) { return; }
      el.innerHTML = list.length ? list.map(function (g) {
        var have = !!find(g.name);
        return '<div class="row-card"><i class="mat-thumb" style="' + esc(g.texture ? 'background:#ccc url(' + g.texture + ') center/cover' : 'background:' + (g.color || '#ddd')) + '"></i>' +
          '<span class="grow"><span class="t1">' + (g.official ? '<b class="badge">' + esc(G.t('Official')) + '</b> ' : '') + esc(g.name) + (g.brand ? ' <small class="muted">' + esc(g.brand) + '</small>' : '') + '</span>' +
          '<span class="t2">' + esc(len(g.sheet_l) + ' × ' + len(g.sheet_w) + ' · ' + (g.thick || []).map(function (x) { return fmt(x.t) + ' mm'; }).join(', ')) + '</span>' +
          '<span class="t2">' + esc(G.t('Shared by: ') + (g.author && g.author.name || '')) + '</span></span>' +
          (readOnly() || have ? '' : '<button type="button" class="btn small" data-gadd="' + esc(g.id) + '">' + esc(G.t('Add to my list')) + '</button>') +
          (G.gallery.admin('materials', g, renderGallery) ? '<button type="button" class="xbtn" data-gm="' + esc(g.id) + '">⋯</button>' : '') + '</div>';
      }).join('') : '<p class="meta-line">' + esc(G.t('Nothing shared yet.')) + '</p>';
      el.querySelectorAll('[data-gadd]').forEach(function (b) {
        b.onclick = function () {
          var g = list.find(function (x) { return x.id === b.getAttribute('data-gadd'); });
          var e = addEntry(g.name);
          Object.assign(e, { brand: g.brand || '', color: g.color || e.color, sheet_l: g.sheet_l || e.sheet_l, sheet_w: g.sheet_w || e.sheet_w,
                             tex_w: g.tex_w || 0, tex_h: g.tex_h || 0, from_gallery: g.id,
                             thick: (g.thick || []).map(function (x) { return { t: Number(x.t), price: 0, roll_price: 0, roll_m: 0 }; }) });
          saveList();
          (g.texture ? texPut(e.id, g.texture) : Promise.resolve()).then(function () { A.toast(G.t('Added to your list')); renderGallery(); });
        };
      });
      el.querySelectorAll('[data-gm]').forEach(function (b) {
        b.onclick = function () { var g = list.find(function (x) { return x.id === b.getAttribute('data-gm'); }); G.gallery.admin('materials', g, renderGallery)(); };
      });
    }, function (e) { var el = document.getElementById('galList'); if (el) { el.innerHTML = '<p class="warn-line">' + esc(e.code || e.message) + '</p>'; } });
  }

  function renderEdit(e) {
    var hasTex = !!TEX[e.id];
    var dup = data.list.some(function (x) { return x !== e && keyOf(x.name) === keyOf(e.name) && keyOf(e.name); });
    function vb(attr, val, txt) { return '<button type="button" class="valbtn" ' + attr + '="' + val + '">' + esc(txt) + '</button>'; }
    A.show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button>' +
      '<h1>' + esc(e.name || t('New material')) + '<span class="sub">' + esc(t('Material list')) + '</span></h1></header>' +
      '<div class="page">' +
      '<div class="box fields">' +
        '<div class="frow-f stack"><span class="flbl">' + esc(A.t('Name')) + '</span><input class="text-in" id="mName" autocomplete="off" value="' + esc(e.name) + '" placeholder="Grey Bardolino Oak">' +
          (dup ? '<p class="warn-line">' + esc(t('Same name as another material')) + '</p>' : '') +
          '<p class="meta-line">' + esc(t('Used in modules by name. Change it here and in the modules together.')) + '</p></div>' +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('Brand')) + '</span><input class="text-in" id="mBrand" autocomplete="off" value="' + esc(e.brand || '') + '" placeholder="EGGER"></div>' +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('Board type')) + '</span><select class="sel" id="mType">' + Object.keys(TYPE_L).map(function (k) {
          return '<option value="' + k + '"' + ((e.type || 'melamine') === k ? ' selected' : '') + '>' + esc(t(TYPE_L[k])) + '</option>';
        }).join('') + '</select></div>' +
      '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Texture')) + '</h3>' +
        '<div class="mat-tex" style="' + esc(swatchCss(e.name)) + '"></div>' +
        '<div style="display:flex;gap:8px;margin:8px 0 4px"><button type="button" class="btn small" id="mImg" style="flex:1">' + esc(t(hasTex ? 'Change image' : 'Choose image')) + '</button>' +
          (hasTex ? '<button type="button" class="btn small" id="mImgDel" style="flex:1">' + esc(t('Remove image')) + '</button>'
                  : '<label class="btn small mat-color" style="flex:1">' + esc(t('Colour')) + ' <input type="color" id="mColor" value="' + esc(e.color || '#d8d2c4') + '"></label>') + '</div>' +
        (hasTex ? '<div class="frow-f"><span class="flbl">' + esc(t('Image covers (along the grain)')) + '</span>' + vb('data-len', 'tex_w', len(e.tex_w || e.sheet_l)) + '</div>' +
                  '<div class="frow-f"><span class="flbl">' + esc(t('Image covers (across)')) + '</span>' + vb('data-len', 'tex_h', len(e.tex_h || e.sheet_w)) + '</div>' : '') +
      '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Sheet')) + '</h3>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Sheet length')) + '</span>' + vb('data-len', 'sheet_l', len(e.sheet_l)) + '</div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Sheet width')) + '</span>' + vb('data-len', 'sheet_w', len(e.sheet_w)) + '</div>' +
      '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Thicknesses')) + '</h3>' +
        '<p class="meta-line">' + esc(t('Edge tape is costed in whole rolls: 1 m over a roll buys another roll.')) + '</p>' +
        (e.thick || []).map(function (x, i) {
          return '<div class="mat-thick">' +
            '<div class="frow-f"><span class="flbl"><b>' + esc(t('Thickness')) + '</b></span>' + vb('data-th', i + ':t', fmt(x.t) + ' mm') +
              '<button type="button" class="xbtn" data-thdel="' + i + '" aria-label="' + esc(A.t('Delete')) + '">✕</button></div>' +
            '<div class="frow-f"><span class="flbl">' + esc(t('Price per sheet')) + '</span>' + vb('data-th', i + ':price', money(x.price)) + '</div>' +
            '<div class="frow-f"><span class="flbl">' + esc(t('Edge tape roll price')) + '</span>' + vb('data-th', i + ':roll_price', money(x.roll_price)) + '</div>' +
            '<div class="frow-f"><span class="flbl">' + esc(t('Roll length')) + '</span>' + vb('data-th', i + ':roll_m', fmt(x.roll_m || 0) + ' m') + '</div>' +
            '<div class="frow-f"><span class="flbl">' + esc(t('Edge banding work per metre')) + '</span>' + vb('data-th', i + ':apply_m', money(x.apply_m)) + '</div></div>';
        }).join('') +
        '<button type="button" class="btn small" id="mAddT" style="width:100%;margin-top:8px">' + esc(t('+ Thickness')) + '</button>' +
      '</div>' +
      '<div class="box fields">' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Has grain')) + '<small class="meta-line" style="display:block">' + esc(t('Wood patterns: parts follow the grain of the sheet.')) + '</small></span>' +
          '<label class="switch"><input type="checkbox" id="mGrain"' + (e.grain !== false ? ' checked' : '') + '><span></span></label></div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Default material')) + '<small class="meta-line" style="display:block">' + esc(t('New modules start with it (carcass).')) + '</small></span>' +
          '<label class="switch"><input type="checkbox" id="mDef"' + (e.default ? ' checked' : '') + '><span></span></label></div>' +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('Notes')) + '</span><textarea class="text-in" id="mNotes" rows="3">' + esc(e.notes || '') + '</textarea></div>' +
      '</div>' +
      (cloud() ? '<button type="button" class="btn small" id="mShare" style="width:100%;margin-top:8px">' + esc(cloud().t(e.gallery_id ? 'Remove from public gallery' : 'Share to public gallery')) + '</button>' +
                 '<p class="meta-line">' + esc(cloud().t('Prices stay private: only the texture, sheet size and thicknesses are shared.')) + '</p>' : '') +
      '<button type="button" class="btn danger" id="mDel" style="width:100%;margin:8px 0 24px">' + esc(t('Delete material')) + '</button>' +
      '</div>'
    );
    function touch() { e.updated = new Date().toISOString(); saveList(); }
    document.getElementById('back').onclick = function () { history.back(); };
    document.getElementById('mName').onchange = function () { e.name = this.value.trim(); touch(); renderEdit(e); };
    document.getElementById('mBrand').onchange = function () { e.brand = this.value.trim(); touch(); };
    document.getElementById('mType').onchange = function () { e.type = this.value; touch(); };
    document.getElementById('mNotes').onchange = function () { e.notes = this.value; touch(); };
    document.getElementById('mGrain').onchange = function () { e.grain = this.checked; touch(); };
    document.getElementById('mDef').onchange = function () {
      var on = this.checked;
      data.list.forEach(function (x) { if (x !== e && x.default) { x.default = false; x.updated = new Date().toISOString(); } });
      e.default = on; touch();
    };
    var col = document.getElementById('mColor');
    if (col) { col.oninput = function () { e.color = col.value; document.querySelector('.mat-tex').style.background = col.value; }; col.onchange = function () { touch(); }; }
    document.getElementById('mImg').onclick = function () {
      pickImage(function (f) {
        readImage(f).then(function (url) {
          return texPut(e.id, url).then(function () { touch(); renderEdit(e); }, function () { A.toast(t('Could not save the image on this phone.')); });
        }, function () { A.toast(t('Could not read this image.')); });
      });
    };
    var del = document.getElementById('mImgDel');
    if (del) { del.onclick = function () { texDel(e.id).then(function () { touch(); renderEdit(e); }); }; }
    document.querySelectorAll('[data-len]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-len');
        A.openPad({ label: b.parentNode.querySelector('.flbl').textContent, value: e[k] || (k === 'tex_w' ? e.sheet_l : k === 'tex_h' ? e.sheet_w : 0),
                    done: function (v) { e[k] = v; touch(); renderEdit(e); } });
      };
    });
    document.querySelectorAll('[data-th]').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-th').split(':'), x = e.thick[+a[0]], k = a[1];
        var unit = k === 't' ? 'mm' : k === 'roll_m' ? 'm' : (A.prefsOpt().currency || '$');
        A.openPad({ label: b.parentNode.querySelector('.flbl').textContent + (k !== 't' ? ' · ' + fmt(x.t) + ' mm' : ''), value: x[k] || 0,
                    allowZero: k !== 't', unit: unit, done: function (v) {
          x[k] = v;
          if (k === 't') { e.thick.sort(function (p, q) { return p.t - q.t; }); }
          touch(); renderEdit(e);
        } });
      };
    });
    document.querySelectorAll('[data-thdel]').forEach(function (b) {
      b.onclick = function () { e.thick.splice(+b.getAttribute('data-thdel'), 1); touch(); renderEdit(e); };
    });
    document.getElementById('mAddT').onclick = function () {
      var last = e.thick[e.thick.length - 1];
      A.openPad({ label: t('Thickness'), value: null, unit: 'mm', chips: [9, 12, 15, 16, 18, 25, 36], done: function (v) {
        if (!thick(e, v)) { var th = thick(e, v, true); if (last) { th.roll_m = last.roll_m; } }
        touch(); renderEdit(e);
      } });
    };
    var sh = document.getElementById('mShare');
    if (sh) {
      sh.onclick = function () {
        var G = cloud();
        if (e.gallery_id) {
          G.gallery.unshareMaterial(e.gallery_id).then(function () { delete e.gallery_id; touch(); A.toast(G.t('Removed from the public gallery')); renderEdit(e); }, function (x) { A.toast(x.code || x.message); });
        } else {
          if (!e.name) { document.getElementById('mName').focus(); return; }
          G.gallery.shareMaterial(e, TEX[e.id]).then(function (id) { e.gallery_id = id; touch(); A.toast(G.t('Shared to the public gallery')); renderEdit(e); }, function (x) { A.toast(x.code || x.message); });
        }
      };
    }
    lockIfReadOnly();
    document.getElementById('mDel').onclick = function () {
      if (!confirm(t('Delete this material?'))) { return; }
      data.list = data.list.filter(function (x) { return x !== e; });
      texDel(e.id); saveList();
      A.go('#/materials', true);
    };
  }

  // ------------------------------------------------------------------ picker (module material boxes)
  // Your list first, then the PanelPro catalog by brand; type to filter. done(name).
  function pick(current, done) {
    loadCatalog().catch(function () {}).then(function () {
      var ov = document.createElement('div');
      ov.className = 'menu mpick';
      ov.innerHTML = '<div class="menu-sheet mpick-sheet"><div class="mpick-h"><input class="text-in" id="mpQ" type="search" placeholder="' + esc(t('Search')) + '">' +
        '<button type="button" class="xbtn" data-mpx="1" aria-label="' + esc(A.t('Close')) + '">✕</button></div><div class="mpick-list" id="mpL"></div></div>';
      document.body.appendChild(ov);
      function row(name, brand, sub, css) {
        return '<button type="button" class="mpick-row' + (keyOf(name) === keyOf(current) ? ' on' : '') + '" data-mp="' + esc(name) + '"><i style="' + esc(css) + '"></i>' +
          '<span><b>' + esc(name) + '</b><small>' + esc(sub) + '</small></span></button>';
      }
      function draw() {
        var q = keyOf(document.getElementById('mpQ').value), h = '';
        var mine = data.list.filter(function (e) { return !q || keyOf(e.name + ' ' + (e.brand || '')).indexOf(q) >= 0; });
        if (mine.length) {
          h += '<div class="mpick-g">' + esc(cloud() ? cloud().t('My list') : t('Material list')) + '</div>' +
            mine.map(function (e) { return row(e.name, e.brand, len(e.sheet_l) + ' × ' + len(e.sheet_w) + (thicksTxt(e) ? ' · ' + thicksTxt(e) : ''), swatchCss(e.name)); }).join('');
        }
        var groups = {};
        (CAT || []).forEach(function (c) {
          if (find(c.material) || (q && keyOf(c.material + ' ' + (c.notes || '')).indexOf(q) < 0)) { return; }
          (groups[c.brand || t('Other')] = groups[c.brand || t('Other')] || []).push(c);
        });
        Object.keys(groups).forEach(function (b) {
          h += '<div class="mpick-g">' + esc(t('PanelPro catalog') + ' · ' + b) + '</div>' + groups[b].map(function (c) {
            return row(c.material, c.brand, len(c.sheet_l) + ' × ' + len(c.sheet_w) + ' · ' + c.thick.map(function (x) { return fmt(x) + ' mm'; }).join(', '), swatchCss(c.material));
          }).join('');
        });
        document.getElementById('mpL').innerHTML = h || '<p class="meta-line" style="padding:12px">' + esc(t('No match.')) + '</p>';
      }
      ov.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-mp]');
        if (b) { ov.remove(); done(b.getAttribute('data-mp')); return; }
        if (ev.target === ov || ev.target.closest('[data-mpx]')) { ov.remove(); }
      });
      document.getElementById('mpQ').oninput = draw;
      draw();
      if (!('ontouchstart' in window)) { document.getElementById('mpQ').focus(); }
    });
  }

  // ------------------------------------------------------------------ files
  function exportList() {
    var out = { panelpro_materials: 1, tape: data.tape, materials: data.list.map(function (e) {
      var c = JSON.parse(JSON.stringify(e));
      if (TEX[e.id]) { c.texture = TEX[e.id]; }
      return c;
    }) };
    A.shareFile('PanelPro materials.json', JSON.stringify(out), 'application/json');
  }
  // Same name → replaced; new names → added.
  function importList(text) {
    loadCatalog().catch(function () {}).then(function () { importNow(text); });
  }
  function importNow(text) {
    var d;
    try { d = JSON.parse(text); } catch (err) { d = null; }
    if (!d || d[FORMAT] !== 1 || !Array.isArray(d.materials)) { A.toast(t('This file is not a PanelPro materials file.')); return; }
    var n = 0, jobs = [];
    d.materials.forEach(function (m) {
      if (!m || !m.name) { return; }
      var old = find(m.name), e = old || { id: A.uid() };
      ['name', 'brand', 'color', 'sheet_l', 'sheet_w', 'tex_w', 'tex_h', 'thick', 'updated', 'type', 'notes', 'grain', 'default', 'catalog'].forEach(function (k) { if (m[k] != null) { e[k] = m[k]; } });
      e.thick = Array.isArray(e.thick) ? e.thick : [];
      if (!old) { data.list.push(e); }
      // a catalog material: its image comes from the catalog (sized like the catalog's)
      var cm = m.catalog && (CAT || []).find(function (c) { return c.id === m.catalog; });
      if (cm && !(e.tex_w > 0)) { var cx = catTex(cm); e.tex_w = cx.w; e.tex_h = cx.h; }
      if (typeof m.texture === 'string' && (m.texture.indexOf('data:image/') === 0 || /^catalog\/tex\//.test(m.texture))) { jobs.push(texPut(e.id, m.texture)); }
      n++;
    });
    if (d.tape && !(data.tape.roll_m > 0)) { data.tape = d.tape; }
    saveList();
    Promise.all(jobs).catch(function () {}).then(function () {
      A.toast(t('Imported materials: ') + n);
      if (/^#\/materials/.test(location.hash)) { renderList(); }
    });
  }

  // ------------------------------------------------------------------ public
  // The phone's own list (first sign-in copies it into the account).
  function localData() {
    var d = A.loadPref(KEY, null) || { list: [], tape: {} };
    return { list: d.list || [], tape: d.tape || {}, textures: function () {
      var out = {};
      return tx('readonly', function (st) {
        var req = st.openCursor();
        req.onsuccess = function () { var c = req.result; if (c) { out[c.key] = c.value; c.continue(); } };
      }).then(function () { return out; }, function () { return out; });
    } };
  }
  window.PPMaterials = {
    init: function () {
      loadCatalog().catch(function () {});
      if (cloud()) { fillDatalist(); return Promise.resolve(); }
      loadList(); fillDatalist(); return texLoadAll();
    },
    defaultMaterial: function () { var e = data.list.find(function (x) { return x.default; }); return e ? e.name : null; },
    localData: localData,
    cloudReset: function () { data = { list: [], tape: { roll_price: 0, roll_m: 0 } }; TEX = {}; stamp++; fillDatalist(); },
    cloudList: function (list) { data.list = list.sort(function (a, b) { return a.name.localeCompare(b.name); }); stamp++; fillDatalist(); },
    cloudTexture: function (id, url) { if (url) { TEX[id] = url; } else { delete TEX[id]; } stamp++; },
    cloudTape: function (tp) { data.tape = Object.assign({ roll_price: 0, roll_m: 0 }, tp); stamp++; },
    tape: function () { return data.tape; },
    route: function (p) {
      if (p[1] === 'gallery' && cloud()) { return renderGallery(); }
      if (p[1] === 'catalog') { return renderCatalog(); }
      if (p[1]) { var e = byId(p[1]); if (e) { return renderEdit(e); } }
      return renderList();
    },
    pick: pick, find: find, info: info, swatchCss: swatchCss, engineList: engineList, costDefaults: costDefaults, setPrice: setPrice,
    stamp: function () { return stamp; },
    // open the list entry for a cut-list group (added if missing, with its thickness)
    openFor: function (name, T) {
      var e = find(name) || addEntry(name);
      thick(e, T, true); saveList();
      A.go('#/materials/' + encodeURIComponent(e.id));
    },
    t: t
  };
})();
