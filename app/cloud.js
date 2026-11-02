/* PanelPro Web — accounts, sync, plans, companies and the public gallery (Firebase).
 *
 * Interface + data only: modules are still built by the shared engine. With no Firebase
 * configuration (firebase-config.js empty) the app runs as before, data on this phone only.
 *
 * Firestore layout (rules in cloud/firestore.rules):
 *   users/{uid}                              account: name, email, photo, trial_end, plan, plan_until, prefs
 *   {users/{uid} | companies/{cid}}/sites/{id}      a project: f = { field: JSON }, m = { moduleId: JSON }
 *                                  /materials/{id}  j = material list entry (JSON)
 *                                  /textures/{id}   data = texture image (data URL)
 *                                  /settings/main   j = part names, optimizer, my presets, finish sets, default tape roll
 *   companies/{cid}                          name, members {uid: {name, email, role}}, memberIds, admins
 *   invites/{cid}_{email}                    an invitation
 *   gallery_modules/{id}, gallery_materials/{id}    the public gallery (author, official)
 *   config/app                               developers, tiers, paypal { client_id, mode, plans }
 * Projects keep one JSON string per field and per module, so two people editing different modules
 * of the same project don't overwrite each other.
 */
(function () {
  'use strict';
  var A = window.PPApp, FB = window.FB, CFG = window.PP_FIREBASE || null;
  var ON = !!(CFG && CFG.apiKey && FB);
  var DAY = 864e5;
  var TIERS = {
    web: { web: true, plugin: false, materials: true, gallery: true },
    lite: { web: false, plugin: true, materials: true, gallery: true },
    full: { web: true, plugin: true, materials: true, gallery: true }
  };
  var TIER_NAME = { web: 'Web', lite: 'Plugin Lite', full: 'Full' };

  var ES = {
    'Sign in with Google': 'Iniciar sesión con Google', 'Sign out': 'Cerrar sesión', 'Account': 'Cuenta',
    'Your projects, materials and settings, on every device.': 'Sus proyectos, materiales y ajustes, en todos sus dispositivos.',
    'New accounts get 7 days of Full free.': 'Las cuentas nuevas tienen 7 días gratis del plan Full.',
    'Signing in…': 'Iniciando sesión…', 'Could not sign in: ': 'No se pudo iniciar sesión: ', 'Loading your data…': 'Cargando sus datos…',
    'Personal': 'Personal', 'Companies': 'Empresas', 'Company': 'Empresa', 'Plans': 'Planes', 'Plan': 'Plan',
    'Free trial': 'Prueba gratis', 'days left': 'días restantes', 'day left': 'día restante', 'until': 'hasta', 'No plan': 'Sin plan',
    'Your plan does not include the web app.': 'Su plan no incluye la app web.', 'Your free trial has ended.': 'Su prueba gratis terminó.',
    'Choose a plan to keep working. Your projects are safe.': 'Elija un plan para seguir trabajando. Sus proyectos están a salvo.',
    'Web app (phone, tablet, computer)': 'App web (teléfono, tableta, computadora)', 'SketchUp plugin': 'Plugin de SketchUp',
    'Limited SketchUp plugin': 'Plugin de SketchUp limitado', 'Full web app + full SketchUp plugin': 'App web completa + plugin de SketchUp completo',
    'Plans are not on sale yet.': 'Los planes aún no están a la venta.', 'Current plan': 'Plan actual', 'monthly': 'mensual', 'yearly': 'anual',
    'Thank you! Your plan is active.': '¡Gracias! Su plan está activo.', 'Payment received; your plan will show in a moment.': 'Pago recibido; su plan aparecerá en un momento.',
    'Manage or cancel in PayPal': 'Administrar o cancelar en PayPal', 'Sign out of SketchUp everywhere': 'Cerrar sesión de SketchUp en todas partes',
    'SketchUp plugins signed in: ': 'Plugins de SketchUp con sesión: ', 'Signed out of SketchUp.': 'Sesión de SketchUp cerrada.',
    'Connect SketchUp': 'Conectar SketchUp', 'SketchUp is signed in. You can close this tab and go back to SketchUp.': 'SketchUp tiene la sesión iniciada. Puede cerrar esta pestaña y volver a SketchUp.',
    'Connecting SketchUp…': 'Conectando SketchUp…', 'This sign-in link has expired. Start again from SketchUp.': 'Este enlace de inicio de sesión venció. Empiece otra vez desde SketchUp.',
    'Could not connect SketchUp: ': 'No se pudo conectar SketchUp: ',
    'New company': 'Empresa nueva', 'Company name': 'Nombre de la empresa', 'Members': 'Miembros', 'Invite by email': 'Invitar por correo',
    'Google email of the person to invite': 'Correo de Google de la persona a invitar', 'Invitation sent': 'Invitación creada',
    'Pending invitations': 'Invitaciones pendientes', 'admin': 'administrador', 'member': 'miembro', 'Make admin': 'Hacer administrador',
    'Remove from company': 'Quitar de la empresa', 'Leave company': 'Salir de la empresa', 'Delete company': 'Eliminar empresa',
    'Delete this company and all its projects and materials?': '¿Eliminar esta empresa con todos sus proyectos y materiales?',
    'Leave this company? You lose access to its projects.': '¿Salir de esta empresa? Pierde el acceso a sus proyectos.',
    'Make another member admin before you leave.': 'Haga administrador a otro miembro antes de salir.',
    'You are invited to join ': 'Le invitan a unirse a ', 'Accept': 'Aceptar', 'Decline': 'Rechazar', 'Joined ': 'Se unió a ',
    'Send the invitation by WhatsApp': 'Enviar la invitación por WhatsApp', 'Rename company': 'Renombrar empresa',
    'Only admins change company materials and settings.': 'Solo los administradores cambian los materiales y ajustes de la empresa.',
    'Move to a company…': 'Mover a una empresa…', 'Move to': 'Mover a', 'Moved to ': 'Movido a ', 'Work in': 'Trabajar en',
    'Public gallery': 'Galería pública', 'Share to public gallery': 'Compartir en la galería pública', 'Remove from public gallery': 'Quitar de la galería pública',
    'Shared to the public gallery': 'Compartido en la galería pública', 'Removed from the public gallery': 'Quitado de la galería pública',
    'Shared by: ': 'Compartido por: ', 'Official': 'Oficial', 'Add to my list': 'Agregar a mi lista', 'Added to your list': 'Agregado a su lista',
    'Nothing shared yet.': 'Aún no hay nada compartido.', 'My list': 'Mi lista', 'Mark official': 'Marcar oficial', 'Not official': 'No oficial',
    'Remove from gallery': 'Quitar de la galería', 'Remove this item from the public gallery?': '¿Quitar este elemento de la galería pública?',
    'Prices stay private: only the texture, sheet size and thicknesses are shared.': 'Los precios quedan privados: solo se comparten la textura, el tamaño del tablero y los espesores.',
    'Developer': 'Desarrollador', 'PayPal client ID': 'Client ID de PayPal', 'PayPal mode': 'Modo de PayPal', 'Sandbox (tests)': 'Sandbox (pruebas)', 'Live': 'Real',
    'PayPal plans': 'Planes de PayPal', 'PayPal plan ID': 'ID del plan de PayPal', 'Price label': 'Precio (texto)', '+ Plan': '+ Plan',
    'Tier switches': 'Interruptores de los planes', 'Give a plan': 'Dar un plan', 'User email': 'Correo del usuario', 'Days': 'Días',
    'Plan given': 'Plan asignado', 'No user with that email (they must sign in once).': 'No hay un usuario con ese correo (debe iniciar sesión una vez).',
    'Saved': 'Guardado', 'Offline: changes are saved on this device and sent when you are back online.': 'Sin conexión: los cambios se guardan en este dispositivo y se envían al volver la conexión.',
    'Your data from this phone was copied to your account.': 'Los datos de este teléfono se copiaron a su cuenta.',
    'This project is too big to sync (over 1 MB).': 'Este proyecto es muy grande para sincronizar (más de 1 MB).',
    'Could not save to your account: ': 'No se pudo guardar en su cuenta: ', 'Your user ID': 'Su ID de usuario', 'materials': 'materiales', 'gallery': 'galería', 'web': 'web', 'plugin': 'plugin'
  };
  function t(s) { return A.lang() === 'es' && ES[s] ? ES[s] : A.t(s); }
  var esc = A.esc;
  function $(s) { return document.querySelector(s); }
  function ms(v) { return !v ? 0 : typeof v === 'number' ? v : v.toMillis ? v.toMillis() : Date.parse(v) || 0; }
  function J(v) { return JSON.stringify(v === undefined ? null : v); }
  function P(s) { try { return JSON.parse(s); } catch (e) { return null; } }

  // ------------------------------------------------------------------ state
  var app, auth, db, fns;
  var user = null, account = null, appCfg = {}, companies = [], invites = [];
  var space = null;          // { kind: 'user' | 'company', id, name, admin }
  var subs = [], userSubs = [];
  var lastSites = {}, lastMats = {}, lastTex = {}, lastSettings = null;
  var loaded = {}, onReady = null, started = false, accountMade = false;

  function base() { return space.kind === 'user' ? 'users/' + space.id : 'companies/' + space.id; }
  function col(name) { return FB.collection(db, base() + '/' + name); }
  function dref(path) { return FB.doc(db, path); }
  function isDev() { return !!(user && appCfg.developers && appCfg.developers.indexOf(user.uid) >= 0); }
  function ent() {
    var now = Date.now();
    if (isDev()) { return { tier: 'full', until: now + 3650 * DAY, trial: false, dev: true }; }
    var a = account || {}, pu = ms(a.plan_until), te = ms(a.trial_end);
    if (a.plan && TIERS[a.plan] && pu > now) { return { tier: a.plan, until: pu, trial: false }; }
    if (te > now) { return { tier: 'full', until: te, trial: true }; }
    return { tier: null, until: Math.max(pu, te), trial: false };
  }
  function feats() {
    var all = Object.assign({}, TIERS, appCfg.tiers || {}), e = ent();
    return e.tier ? Object.assign({ web: false, plugin: false, materials: false, gallery: false }, all[e.tier]) : {};
  }
  function canWeb() { return !!feats().web; }
  function canEdit() { return space && (space.kind === 'user' || space.admin); } // materials + settings
  function err(e) { A.toast(t('Could not save to your account: ') + (e && (e.code || e.message) || e)); }

  // ------------------------------------------------------------------ start
  function start(ready) {
    onReady = ready;
    app = FB.initializeApp(CFG);
    auth = FB.getAuth(app);
    db = FB.initializeFirestore(app, { localCache: FB.persistentLocalCache({ tabManager: FB.persistentMultipleTabManager() }), ignoreUndefinedProperties: true });
    fns = FB.getFunctions(app, 'us-central1');
    var emu = A.loadPref('pp.emulator', null);
    if (emu) {
      FB.connectAuthEmulator(auth, 'http://' + emu + ':9099', { disableWarnings: true });
      FB.connectFirestoreEmulator(db, emu, 8080);
      FB.connectFunctionsEmulator(fns, emu, 5001);
    }
    FB.getRedirectResult(auth).catch(function () {});
    FB.onAuthStateChanged(auth, function (u) {
      stopAll();
      user = u; account = null; space = null; started = false; accountMade = false;
      if (!u) { A.hideBoot(); renderSignIn(); return; }
      bootUser();
    });
    window.addEventListener('offline', function () { A.toast(t('Offline: changes are saved on this device and sent when you are back online.')); });
  }

  function stopAll() {
    subs.concat(userSubs).forEach(function (f) { try { f(); } catch (e) {} });
    subs = []; userSubs = [];
    lastSites = {}; lastMats = {}; lastTex = {}; lastSettings = null;
  }

  function renderSignIn(msg) {
    A.show('<div class="signin"><div class="boot-mark" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<h1>PanelPro</h1><p>' + esc(t('Your projects, materials and settings, on every device.')) + '</p>' +
      '<button type="button" class="btn primary gbtn" id="gSign"><span class="g">G</span> ' + esc(t('Sign in with Google')) + '</button>' +
      '<p class="meta-line">' + esc(t('New accounts get 7 days of Full free.')) + '</p>' +
      (msg ? '<p class="warn-line">' + esc(msg) + '</p>' : '') +
      '<button type="button" class="text-btn" id="gLang">' + (A.lang() === 'es' ? 'English' : 'Español') + '</button></div>');
    $('#gLang').onclick = function () { A.setLang(A.lang() === 'es' ? 'en' : 'es'); renderSignIn(msg); };
    $('#gSign').onclick = function () {
      var p = new FB.GoogleAuthProvider();
      p.setCustomParameters({ prompt: 'select_account' });
      this.disabled = true; this.textContent = t('Signing in…');
      FB.signInWithPopup(auth, p).catch(function (e) {
        if (e && /popup-blocked|operation-not-supported/.test(e.code || '')) { return FB.signInWithRedirect(auth, p); }
        if (e && /popup-closed|cancelled-popup/.test(e.code || '')) { renderSignIn(); return; }
        renderSignIn(t('Could not sign in: ') + (e && (e.code || e.message)));
      });
    };
  }

  function bootUser() {
    A.showLoading(t('Loading your data…'));
    var uref = dref('users/' + user.uid);
    userSubs.push(FB.onSnapshot(dref('config/app'), function (s) { appCfg = s.exists() ? s.data() : {}; afterAccount(); }, function () { appCfg = {}; afterAccount(); }));
    userSubs.push(FB.onSnapshot(uref, function (s) {
      if (!s.exists()) {
        if (accountMade) { return; }
        accountMade = true;
        FB.setDoc(uref, { name: user.displayName || '', email: (user.email || '').toLowerCase(), photo: user.photoURL || '',
                          created: FB.serverTimestamp(), trial_end: FB.Timestamp.fromMillis(Date.now() + 7 * DAY - 60e3),
                          prefs: { units: A.prefs().units, lang: A.lang() } }).catch(err);
        return;
      }
      account = s.data();
      // keep the profile fresh (name / photo changed in Google)
      if (account.name !== (user.displayName || '') || account.photo !== (user.photoURL || '')) {
        FB.updateDoc(uref, { name: user.displayName || '', photo: user.photoURL || '' }).catch(function () {});
      }
      if (account.prefs && account.prefs.units && account.prefs.units !== A.prefs().units) { A.prefs().units = account.prefs.units; }
      afterAccount();
    }, function (e) { renderSignIn(t('Could not sign in: ') + (e.code || e.message)); }));
    userSubs.push(FB.onSnapshot(FB.query(FB.collection(db, 'companies'), FB.where('memberIds', 'array-contains', user.uid)), function (q) {
      companies = q.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }).sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (space && space.kind === 'company') {
        var c = companies.find(function (x) { return x.id === space.id; });
        if (!c) { pickSpace('user'); return; }
        space.name = c.name; space.admin = (c.admins || []).indexOf(user.uid) >= 0;
      }
      if (started) { rerender(); }
    }, function () {}));
    userSubs.push(FB.onSnapshot(FB.query(FB.collection(db, 'invites'), FB.where('email', '==', (user.email || '').toLowerCase())), function (q) {
      invites = q.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
      if (started) { rerender(); }
    }, function () {}));
  }

  var accountTimer = null;
  function afterAccount() {
    if (!account) { return; }
    clearTimeout(accountTimer);
    accountTimer = setTimeout(function () {
      if (!canWeb()) {
        if (space) { stopSpace(); space = null; }
        started = true;
        A.hideBoot(); A.route();
        return;
      }
      if (!space) {
        migrateLocal().then(function () {
          var want = A.loadPref('panelpro.web.space.' + user.uid, 'user');
          pickSpace(companies.some(function (c) { return c.id === want; }) ? want : 'user', true);
        });
      } else if (started) { rerender(); }
    }, 30);
  }

  // ------------------------------------------------------------------ spaces
  function stopSpace() { subs.forEach(function (f) { try { f(); } catch (e) {} }); subs = []; lastSites = {}; lastMats = {}; lastTex = {}; lastSettings = null; }
  function pickSpace(id, first) {
    stopSpace();
    if (id === 'user' || !id) { space = { kind: 'user', id: user.uid, name: t('Personal'), admin: true }; }
    else {
      var c = companies.find(function (x) { return x.id === id; });
      space = { kind: 'company', id: id, name: c ? c.name : t('Company'), admin: !!(c && (c.admins || []).indexOf(user.uid) >= 0) };
    }
    A.savePref('panelpro.web.space.' + user.uid, space.kind === 'user' ? 'user' : space.id);
    var arr = A.sites();
    arr.length = 0;
    window.PPMaterials.cloudReset();
    A.resetPrefs();
    loaded = {};
    var done = function (k) {
      loaded[k] = true;
      if (loaded.sites && loaded.materials && loaded.textures && loaded.settings && !started) {
        started = true; A.hideBoot();
        if (!first) { A.go('#/', true); }
        A.route();
      }
    };
    started = false;
    subs.push(FB.onSnapshot(col('sites'), function (q) { applySites(q); done('sites'); }, function (e) { err(e); done('sites'); }));
    subs.push(FB.onSnapshot(col('materials'), function (q) { applyMats(q); done('materials'); }, function () { done('materials'); }));
    subs.push(FB.onSnapshot(col('textures'), function (q) { applyTex(q); done('textures'); }, function () { done('textures'); }));
    subs.push(FB.onSnapshot(dref(base() + '/settings/main'), function (s) { applySettings(s); done('settings'); }, function () { done('settings'); }));
  }

  // Redraw lists after a change from another device; never under an open editor or keypad.
  var rr = null;
  function rerender() {
    clearTimeout(rr);
    rr = setTimeout(function () {
      var h = location.hash;
      if (!$('#pad').hidden || document.querySelector('.menu')) { return; }
      if (/\/m\/|\/new\/|\/compose|\/opt|\/materials\/.+|\/dev|\/company\//.test(h)) { return; }
      if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { return; }
      A.route();
    }, 250);
  }

  // ------------------------------------------------------------------ projects
  function siteState(s) {
    var f = {}, m = {};
    Object.keys(s).forEach(function (k) { if (k !== 'modules') { f[k] = J(s[k]); } });
    (s.modules || []).forEach(function (x) { m[x.id] = J(x); });
    return { f: f, m: m };
  }
  function applySites(q) {
    var arr = A.sites(), changed = false;
    q.docChanges().forEach(function (ch) {
      var id = ch.doc.id, i = arr.findIndex(function (s) { return s.id === id; });
      if (ch.type === 'removed') {
        if (i >= 0) { arr.splice(i, 1); changed = true; }
        delete lastSites[id];
        return;
      }
      var d = ch.doc.data(), f = d.f || {}, m = d.m || {};
      var prev = lastSites[id];
      if (prev && J(prev.f) === J(f) && J(prev.m) === J(m)) { return; } // our own write coming back
      lastSites[id] = { f: Object.assign({}, f), m: Object.assign({}, m) };
      var fields = {};
      Object.keys(f).forEach(function (k) { fields[k] = P(f[k]); });
      var mods = Object.keys(m).map(function (k) { return P(m[k]); }).filter(Boolean)
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
      if (i < 0) { fields.id = id; fields.modules = mods; arr.push(fields); changed = true; return; }
      var s = arr[i];  // update in place: open screens keep their references
      Object.keys(s).forEach(function (k) { if (k !== 'modules' && !(k in fields)) { delete s[k]; } });
      Object.assign(s, fields);
      var byId = {};
      s.modules.forEach(function (x) { byId[x.id] = x; });
      var next = mods.map(function (x) {
        var o = byId[x.id];
        if (!o) { return x; }
        Object.keys(o).forEach(function (k) { if (!(k in x)) { delete o[k]; } });
        return Object.assign(o, x);
      });
      s.modules.length = 0;
      Array.prototype.push.apply(s.modules, next);
      changed = true;
    });
    if (changed && started) { rerender(); }
  }
  // Called by the app after any change: send only what differs from the last synced state.
  function sitesChanged(arr) {
    if (!space) { return; }
    var seen = {};
    arr.forEach(function (s) {
      seen[s.id] = true;
      var cur = siteState(s), prev = lastSites[s.id], ref = dref(base() + '/sites/' + s.id);
      if (JSON.stringify(cur).length > 950000) { A.toast(t('This project is too big to sync (over 1 MB).')); return; }
      if (!prev) {
        lastSites[s.id] = cur;
        FB.setDoc(ref, { f: cur.f, m: cur.m, at: FB.serverTimestamp() }).catch(err);
        return;
      }
      var up = {}, n = 0;
      Object.keys(cur.f).forEach(function (k) { if (cur.f[k] !== prev.f[k]) { up['f.' + k] = cur.f[k]; n++; } });
      Object.keys(prev.f).forEach(function (k) { if (!(k in cur.f)) { up['f.' + k] = FB.deleteField(); n++; } });
      Object.keys(cur.m).forEach(function (k) { if (cur.m[k] !== prev.m[k]) { up['m.' + k] = cur.m[k]; n++; } });
      Object.keys(prev.m).forEach(function (k) { if (!(k in cur.m)) { up['m.' + k] = FB.deleteField(); n++; } });
      if (!n) { return; }
      lastSites[s.id] = cur;
      up.at = FB.serverTimestamp();
      FB.updateDoc(ref, up).catch(err);
    });
    Object.keys(lastSites).forEach(function (id) {
      if (!seen[id]) { delete lastSites[id]; FB.deleteDoc(dref(base() + '/sites/' + id)).catch(err); }
    });
  }

  // ------------------------------------------------------------------ materials, textures, settings
  function applyMats(q) {
    var list = [];
    q.docs.forEach(function (d) { var e = P(d.data().j); if (e) { e.id = d.id; list.push(e); lastMats[d.id] = d.data().j; } });
    Object.keys(lastMats).forEach(function (id) { if (!q.docs.some(function (d) { return d.id === id; })) { delete lastMats[id]; } });
    window.PPMaterials.cloudList(list);
    if (started) { rerender(); }
  }
  function applyTex(q) {
    q.docChanges().forEach(function (ch) {
      if (ch.type === 'removed') { delete lastTex[ch.doc.id]; window.PPMaterials.cloudTexture(ch.doc.id, null); }
      else { lastTex[ch.doc.id] = true; window.PPMaterials.cloudTexture(ch.doc.id, ch.doc.data().data); }
    });
    if (started) { rerender(); }
  }
  function materialsChanged(list) {
    if (!space || !canEdit()) { return; }
    var seen = {};
    list.forEach(function (e) {
      seen[e.id] = true;
      var c = Object.assign({}, e); delete c.id;
      var j = J(c);
      if (lastMats[e.id] === j) { return; }
      lastMats[e.id] = j;
      FB.setDoc(dref(base() + '/materials/' + e.id), { j: j }).catch(err);
    });
    Object.keys(lastMats).forEach(function (id) { if (!seen[id]) { delete lastMats[id]; FB.deleteDoc(dref(base() + '/materials/' + id)).catch(err); } });
  }
  function texturePut(id, url) {
    if (!space || !canEdit()) { return Promise.resolve(); }
    lastTex[id] = true;
    return FB.setDoc(dref(base() + '/textures/' + id), { data: url });
  }
  function textureDel(id) {
    if (!space || !canEdit() || !lastTex[id]) { return Promise.resolve(); }
    delete lastTex[id];
    return FB.deleteDoc(dref(base() + '/textures/' + id)).catch(function () {});
  }
  function spaceSettings(prefs) {
    return J({ names: prefs.names, opt: prefs.opt, book: prefs.book, finishes: prefs.finishes, tape: window.PPMaterials.tape() });
  }
  function applySettings(s) {
    var d = s.exists() ? P(s.data().j) : null;
    lastSettings = s.exists() ? s.data().j : null;
    if (!d) { return; }
    var p = A.prefs();
    ['names', 'opt', 'book', 'finishes'].forEach(function (k) { if (d[k]) { p[k] = d[k]; } });
    A.fixPrefs();
    if (d.tape) { window.PPMaterials.cloudTape(d.tape); }
    if (started) { rerender(); }
  }
  function prefsChanged(prefs) {
    if (!user || !account) { return; }
    if (!account.prefs || account.prefs.units !== prefs.units) {
      account.prefs = Object.assign({}, account.prefs, { units: prefs.units });
      FB.updateDoc(dref('users/' + user.uid), { 'prefs.units': prefs.units }).catch(function () {});
    }
    if (!space || !canEdit()) { return; }
    var j = spaceSettings(prefs);
    if (j === lastSettings) { return; }
    lastSettings = j;
    FB.setDoc(dref(base() + '/settings/main'), { j: j }).catch(err);
  }

  // First sign-in on a phone that already has data: copy it into the personal space (once per account).
  // The phone's data goes to the first account that signs in on it, and only that one.
  function migrateLocal() {
    if (!account || account.migrated || A.loadPref('panelpro.web.migrated', null)) { return Promise.resolve(); }
    var sites = A.loadPref('panelpro.web.sites.v1', []) || [], prefs = A.loadPref('panelpro.web.prefs.v1', null);
    var mats = window.PPMaterials.localData();
    var jobs = [], root = 'users/' + user.uid;
    sites.forEach(function (s) { var st = siteState(s); jobs.push(FB.setDoc(dref(root + '/sites/' + s.id), { f: st.f, m: st.m, at: FB.serverTimestamp() })); });
    mats.list.forEach(function (e) { var c = Object.assign({}, e); delete c.id; jobs.push(FB.setDoc(dref(root + '/materials/' + e.id), { j: J(c) })); });
    return mats.textures().then(function (tex) {
      Object.keys(tex).forEach(function (id) { jobs.push(FB.setDoc(dref(root + '/textures/' + id), { data: tex[id] })); });
      if (prefs) { jobs.push(FB.setDoc(dref(root + '/settings/main'), { j: J({ names: prefs.names, opt: prefs.opt, book: prefs.book, finishes: prefs.finishes, tape: mats.tape }) })); }
      jobs.push(FB.updateDoc(dref('users/' + user.uid), { migrated: true }));
      return Promise.all(jobs);
    }).then(function () {
      A.savePref('panelpro.web.migrated', user.uid);
      if (sites.length || mats.list.length) {
        A.savePref('panelpro.web.sites.v1.backup', sites);
        try { ['panelpro.web.sites.v1', 'panelpro.web.materials.v1', 'panelpro.web.prefs.v1'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
        A.toast(t('Your data from this phone was copied to your account.'));
      }
    }).catch(err);
  }

  // ------------------------------------------------------------------ screens
  function header(title, sub, more) {
    return '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button>' +
      '<h1>' + esc(title) + (sub ? '<span class="sub">' + esc(sub) + '</span>' : '') + '</h1>' + (more || '') + '</header>';
  }
  function backBtn(to) { $('#back').onclick = function () { if (to) { A.go(to); } else { history.back(); } }; }
  function dateStr(v) { return v ? new Date(v).toLocaleDateString(A.lang()) : '—'; }
  function planLine() {
    var e = ent();
    if (e.dev) { return t('Developer') + ' · Full'; }
    if (!e.tier) { return t('No plan'); }
    if (e.trial) {
      var d = Math.max(0, Math.ceil((e.until - Date.now()) / DAY));
      return t('Free trial') + ' (Full) · ' + d + ' ' + t(d === 1 ? 'day left' : 'days left');
    }
    return TIER_NAME[e.tier] + ' · ' + t('until') + ' ' + dateStr(e.until);
  }

  function renderAccount() {
    var e = ent();
    A.show(header(t('Account')) +
      '<div class="page"><div class="box fields acct">' +
        (user.photoURL ? '<img class="avatar" alt="" src="' + esc(user.photoURL) + '" referrerpolicy="no-referrer">' : '') +
        '<div><b>' + esc(user.displayName || '') + '</b><div class="meta-line">' + esc(user.email || '') + '</div></div></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Plan')) + '</h3><p><b>' + esc(planLine()) + '</b></p>' +
        '<button type="button" class="btn small" id="aPlans" style="width:100%">' + esc(t('Plans')) + ' ›</button>' +
        (account && account.paypal_sub ? '<a class="linkbtn" href="https://www.paypal.com/myaccount/autopay/" target="_blank" rel="noopener">' + esc(t('Manage or cancel in PayPal')) + ' ↗</a>' : '') + '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('SketchUp plugin')) + '</h3>' +
        '<p class="meta-line" id="aPlug"></p>' +
        '<button type="button" class="btn small" id="aPlugOut" style="width:100%">' + esc(t('Sign out of SketchUp everywhere')) + '</button></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Companies')) + '</h3>' +
        '<button type="button" class="btn small" id="aComp" style="width:100%">' + esc(t('Companies')) + ' ›</button></div>' +
      (isDev() ? '<button type="button" class="btn small" id="aDev" style="width:100%;margin:8px 0">' + esc(t('Developer')) + ' ›</button>' : '') +
      '<button type="button" class="btn danger" id="aOut" style="width:100%;margin:8px 0">' + esc(t('Sign out')) + '</button>' +
      '<p class="meta-line" style="text-align:center">' + esc(t('Your user ID')) + ': <code>' + esc(user.uid) + '</code></p>' +
      '</div>');
    backBtn(e.tier && canWeb() ? null : '#/plans');
    $('#aPlans').onclick = function () { A.go('#/plans'); };
    $('#aComp').onclick = function () { A.go('#/companies'); };
    if ($('#aDev')) { $('#aDev').onclick = function () { A.go('#/dev'); }; }
    $('#aOut').onclick = function () { FB.signOut(auth); A.go('#/', true); };
    FB.getDocs(FB.query(FB.collection(db, 'plugin_tokens'), FB.where('uid', '==', user.uid))).then(function (q) {
      var el = $('#aPlug'); if (el) { el.textContent = t('SketchUp plugins signed in: ') + q.size; }
      $('#aPlugOut').onclick = function () {
        Promise.all(q.docs.map(function (d) { return FB.deleteDoc(d.ref); })).then(function () { A.toast(t('Signed out of SketchUp.')); renderAccount(); }, err);
      };
    }, function () { var el = $('#aPlug'); if (el) { el.textContent = ''; } });
  }

  // ---- plans + PayPal
  var paypalLoaded = null;
  function loadPayPal(cid) {
    if (paypalLoaded && paypalLoaded.cid === cid) { return paypalLoaded.p; }
    var p = new Promise(function (ok, bad) {
      var s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(cid) + '&vault=true&intent=subscription&locale=' + (A.lang() === 'es' ? 'es_ES' : 'en_US');
      s.onload = function () { ok(window.paypal); }; s.onerror = bad;
      document.head.appendChild(s);
    });
    paypalLoaded = { cid: cid, p: p };
    return p;
  }
  function renderPlans() {
    var e = ent(), pp = appCfg.paypal || {}, plans = pp.plans || {};
    var blocked = !canWeb();
    var cards = [['web', t('Web app (phone, tablet, computer)')], ['lite', t('Limited SketchUp plugin')], ['full', t('Full web app + full SketchUp plugin')]];
    A.show(header(t('Plans'), planLine(), '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('Account')) + '">⋯</button>') +
      '<div class="page">' +
      (blocked ? '<div class="warn"><p><b>' + esc(t(e.trial || ms(account && account.trial_end) < Date.now() && !(account && account.plan) ? 'Your free trial has ended.' : 'Your plan does not include the web app.')) + '</b> ' +
                 esc(t('Choose a plan to keep working. Your projects are safe.')) + '</p></div>' : '') +
      cards.map(function (c) {
        var ids = Object.keys(plans).filter(function (k) { return plans[k].tier === c[0]; })
          .sort(function (a, b) { return (plans[a].period === 'year') - (plans[b].period === 'year'); });
        return '<div class="box plan' + (e.tier === c[0] && !e.trial ? ' cur' : '') + '"><h3>' + esc(TIER_NAME[c[0]]) +
          (e.tier === c[0] && !e.trial ? ' <small class="muted">· ' + esc(t('Current plan')) + '</small>' : '') + '</h3>' +
          '<p class="meta-line">' + esc(c[1]) + '</p>' +
          ids.map(function (k) {
            return '<div class="pp-row"><span>' + esc((plans[k].price || '') + ' · ' + t(plans[k].period === 'year' ? 'yearly' : 'monthly')) + '</span>' +
              '<div class="pp-btn" data-plan="' + esc(k) + '"></div></div>';
          }).join('') + '</div>';
      }).join('') +
      (!pp.client_id || !Object.keys(plans).length ? '<p class="meta-line">' + esc(t('Plans are not on sale yet.')) + '</p>' : '') +
      '</div>');
    backBtn(blocked ? null : '#/account');
    if (blocked) { $('#back').hidden = true; }
    $('#moreBtn').onclick = function () {
      A.menu(user.email, [{ label: t('Account'), run: function () { A.go('#/account'); } }, { label: t('Sign out'), run: function () { FB.signOut(auth); } }]);
    };
    if (!pp.client_id) { return; }
    loadPayPal(pp.client_id).then(function (paypal) {
      document.querySelectorAll('[data-plan]').forEach(function (el) {
        var planId = el.getAttribute('data-plan');
        paypal.Buttons({
          style: { layout: 'horizontal', label: 'subscribe', height: 40, tagline: false },
          createSubscription: function (_d, actions) { return actions.subscription.create({ plan_id: planId, custom_id: user.uid }); },
          onApprove: function (d) {
            A.toast(t('Payment received; your plan will show in a moment.'));
            FB.httpsCallable(fns, 'confirmSubscription')({ subscriptionId: d.subscriptionID }).then(function () {
              A.toast(t('Thank you! Your plan is active.'));
            }, function () {});
          }
        }).render(el);
      });
    }, function () {});
  }

  // ---- SketchUp sign-in (#/link/<code>)
  function renderLink(code) {
    A.show(header(t('Connect SketchUp')) + '<div class="page"><div class="empty"><h2 id="lkMsg">' + esc(t('Connecting SketchUp…')) + '</h2></div></div>');
    backBtn('#/');
    FB.httpsCallable(fns, 'linkPlugin')({ code: code, device: navigator.userAgent.slice(0, 80) }).then(function () {
      $('#lkMsg').textContent = t('SketchUp is signed in. You can close this tab and go back to SketchUp.');
    }, function (e) {
      $('#lkMsg').textContent = /invalid-argument/.test(e.code || '') ? t('This sign-in link has expired. Start again from SketchUp.') : t('Could not connect SketchUp: ') + (e.code || e.message);
    });
  }

  // ---- companies
  function renderCompanies() {
    A.show(header(t('Companies')) + '<div class="page">' +
      invitesHtml() +
      (companies.length ? '<div class="list">' + companies.map(function (c) {
        var role = (c.admins || []).indexOf(user.uid) >= 0 ? t('admin') : t('member');
        return '<button type="button" class="row-card" data-co="' + esc(c.id) + '"><span class="grow"><span class="t1">' + esc(c.name) + '</span>' +
          '<span class="t2">' + esc((c.memberIds || []).length + ' ' + t('Members').toLowerCase() + ' · ' + role) + '</span></span><span class="chev">›</span></button>';
      }).join('') + '</div>' : '') +
      '</div><div class="dock"><button type="button" class="btn primary" id="newCo">' + esc(t('New company')) + '</button></div>');
    backBtn();
    wireInvites();
    document.querySelectorAll('[data-co]').forEach(function (b) { b.onclick = function () { A.go('#/company/' + encodeURIComponent(b.getAttribute('data-co'))); }; });
    $('#newCo').onclick = function () {
      var name = (prompt(t('Company name')) || '').trim();
      if (!name) { return; }
      var ref = FB.doc(FB.collection(db, 'companies')), me = {};
      me[user.uid] = { name: user.displayName || '', email: (user.email || '').toLowerCase(), role: 'admin' };
      FB.setDoc(ref, { name: name, created: FB.serverTimestamp(), owner: user.uid, members: me, memberIds: [user.uid], admins: [user.uid] })
        .then(function () { A.go('#/company/' + ref.id); }, err);
    };
  }
  function invitesHtml() {
    return invites.map(function (iv) {
      return '<div class="warn invite"><p>' + esc(t('You are invited to join ') + iv.cname) + (iv.byName ? ' <small>(' + esc(iv.byName) + ')</small>' : '') + '</p>' +
        '<div class="actions-row"><button type="button" class="btn small primary" data-acc="' + esc(iv.id) + '">' + esc(t('Accept')) + '</button>' +
        '<button type="button" class="btn small" data-dec="' + esc(iv.id) + '">' + esc(t('Decline')) + '</button></div></div>';
    }).join('');
  }
  function wireInvites() {
    document.querySelectorAll('[data-acc]').forEach(function (b) {
      b.onclick = function () {
        var iv = invites.find(function (x) { return x.id === b.getAttribute('data-acc'); }), up = {};
        up['members.' + user.uid] = { name: user.displayName || '', email: (user.email || '').toLowerCase(), role: 'member' };
        up.memberIds = FB.arrayUnion(user.uid);
        FB.updateDoc(dref('companies/' + iv.cid), up).then(function () {
          return FB.deleteDoc(dref('invites/' + iv.id));
        }).then(function () { A.toast(t('Joined ') + iv.cname); }, err);
      };
    });
    document.querySelectorAll('[data-dec]').forEach(function (b) {
      b.onclick = function () { FB.deleteDoc(dref('invites/' + b.getAttribute('data-dec'))).catch(err); };
    });
  }
  function renderCompany(cid) {
    var c = companies.find(function (x) { return x.id === cid; });
    if (!c) { A.go('#/companies', true); return; }
    var admin = (c.admins || []).indexOf(user.uid) >= 0;
    var mem = Object.keys(c.members || {}).map(function (uid) { return Object.assign({ uid: uid }, c.members[uid]); })
      .sort(function (a, b) { return (a.role === 'admin' ? 0 : 1) - (b.role === 'admin' ? 0 : 1) || (a.name || '').localeCompare(b.name || ''); });
    A.show(header(c.name, t('Company'), admin ? '<button type="button" class="icon-btn" id="moreBtn" aria-label="⋯">⋯</button>' : '') + '<div class="page">' +
      '<button type="button" class="btn primary" id="coWork" style="width:100%;margin-bottom:12px">' + esc(t('Work in') + ' ' + c.name) + '</button>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Members')) + '</h3>' + mem.map(function (m) {
        var isAd = (c.admins || []).indexOf(m.uid) >= 0;
        return '<div class="frow-f"><span class="flbl">' + esc(m.name || m.email) + ' <small class="muted">' + esc(m.email + ' · ' + t(isAd ? 'admin' : 'member')) + '</small></span>' +
          (admin && m.uid !== user.uid ? '<button type="button" class="xbtn" data-mem="' + esc(m.uid) + '" aria-label="⋯">⋯</button>' : '') + '</div>';
      }).join('') + '</div>' +
      (admin ? '<div class="box fields"><h3 class="grp">' + esc(t('Invite by email')) + '</h3>' +
        '<div class="frow-f stack"><input class="text-in" id="ivMail" type="email" autocomplete="off" placeholder="' + esc(t('Google email of the person to invite')) + '"></div>' +
        '<button type="button" class="btn small" id="ivSend" style="width:100%;margin-top:8px">' + esc(t('Invite by email')) + '</button>' +
        '<div id="ivList"></div></div>' : '<p class="meta-line">' + esc(t('Only admins change company materials and settings.')) + '</p>') +
      '<button type="button" class="btn danger" id="coLeave" style="width:100%;margin:8px 0">' + esc(t('Leave company')) + '</button>' +
      '</div>');
    backBtn('#/companies');
    $('#coWork').onclick = function () { pickSpace(cid); };
    $('#coLeave').onclick = function () {
      if (admin && (c.admins || []).length < 2) { A.toast(t('Make another member admin before you leave.')); return; }
      if (!confirm(t('Leave this company? You lose access to its projects.'))) { return; }
      var up = {}; up['members.' + user.uid] = FB.deleteField(); up.memberIds = FB.arrayRemove(user.uid);
      if (admin) { up.admins = FB.arrayRemove(user.uid); }
      FB.updateDoc(dref('companies/' + cid), up).then(function () { if (space && space.id === cid) { pickSpace('user'); } A.go('#/companies', true); }, err);
    };
    if (!admin) { return; }
    $('#moreBtn').onclick = function () {
      A.menu(c.name, [
        { label: t('Rename company'), run: function () { var n = (prompt(t('Company name'), c.name) || '').trim(); if (n) { FB.updateDoc(dref('companies/' + cid), { name: n }).catch(err); } } },
        { label: t('Delete company'), danger: true, run: function () { deleteCompany(c); } }
      ]);
    };
    document.querySelectorAll('[data-mem]').forEach(function (b) {
      b.onclick = function () {
        var uid = b.getAttribute('data-mem'), m = c.members[uid];
        var isAd = (c.admins || []).indexOf(uid) >= 0;
        A.menu(m.name || m.email, [
          isAd ? null : { label: t('Make admin'), run: function () { var up = {}; up['members.' + uid + '.role'] = 'admin'; up.admins = FB.arrayUnion(uid); FB.updateDoc(dref('companies/' + cid), up).catch(err); } },
          { label: t('Remove from company'), danger: true, run: function () {
            var up = {}; up['members.' + uid] = FB.deleteField(); up.memberIds = FB.arrayRemove(uid); up.admins = FB.arrayRemove(uid);
            FB.updateDoc(dref('companies/' + cid), up).catch(err);
          } }
        ].filter(Boolean));
      };
    });
    var loadInv = function () {
      FB.getDocs(FB.query(FB.collection(db, 'invites'), FB.where('cid', '==', cid))).then(function (q) {
        var el = $('#ivList'); if (!el) { return; }
        el.innerHTML = q.size ? '<h3 class="grp">' + esc(t('Pending invitations')) + '</h3>' + q.docs.map(function (d) {
          return '<div class="frow-f"><span class="flbl">' + esc(d.data().email) + '</span><button type="button" class="xbtn" data-iv="' + esc(d.id) + '">✕</button></div>';
        }).join('') : '';
        el.querySelectorAll('[data-iv]').forEach(function (x) { x.onclick = function () { FB.deleteDoc(dref('invites/' + x.getAttribute('data-iv'))).then(loadInv, err); }; });
      }, function () {});
    };
    loadInv();
    $('#ivSend').onclick = function () {
      var mail = ($('#ivMail').value || '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { $('#ivMail').focus(); return; }
      FB.setDoc(dref('invites/' + cid + '_' + mail), { cid: cid, cname: c.name, email: mail, by: user.uid, byName: user.displayName || '', created: FB.serverTimestamp() })
        .then(function () {
          A.toast(t('Invitation sent')); $('#ivMail').value = ''; loadInv();
          var link = (window.PP_WEB_URL || location.href.split('#')[0]);
          var msg = (A.lang() === 'es' ? 'Le invité a ' + c.name + ' en PanelPro. Entre con su cuenta de Google (' + mail + '): ' : 'I invited you to ' + c.name + ' on PanelPro. Sign in with your Google account (' + mail + '): ') + link;
          A.menu(t('Invitation sent'), [{ label: t('Send the invitation by WhatsApp'), run: function () { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); } }]);
        }, err);
    };
  }
  function deleteCompany(c) {
    if (!confirm(t('Delete this company and all its projects and materials?'))) { return; }
    var root = 'companies/' + c.id;
    Promise.all(['sites', 'materials', 'textures', 'settings'].map(function (k) {
      return FB.getDocs(FB.collection(db, root + '/' + k)).then(function (q) { return Promise.all(q.docs.map(function (d) { return FB.deleteDoc(d.ref); })); });
    })).then(function () { return FB.deleteDoc(dref(root)); }).then(function () {
      if (space && space.id === c.id) { pickSpace('user'); }
      A.go('#/companies', true);
    }, err);
  }
  // Move a project into a company (or back to Personal).
  function moveSite(s) {
    var targets = [{ id: 'user', name: t('Personal') }].concat(companies.map(function (c) { return { id: c.id, name: c.name }; }))
      .filter(function (x) { return !(space.kind === 'user' ? x.id === 'user' : x.id === space.id); });
    A.menu(t('Move to'), targets.map(function (x) {
      return { label: x.name, run: function () {
        var root = x.id === 'user' ? 'users/' + user.uid : 'companies/' + x.id, st = siteState(s);
        FB.setDoc(dref(root + '/sites/' + s.id), { f: st.f, m: st.m, at: FB.serverTimestamp() }).then(function () {
          var arr = A.sites(), i = arr.indexOf(s);
          if (i >= 0) { arr.splice(i, 1); }
          A.persist();
          A.toast(t('Moved to ') + x.name); A.go('#/', true);
        }, err);
      } };
    }));
  }
  function spaceMenu() {
    var items = [{ label: (space.kind === 'user' ? '✓ ' : '') + t('Personal'), run: function () { pickSpace('user'); } }]
      .concat(companies.map(function (c) { return { label: (space.id === c.id ? '✓ ' : '') + c.name, run: function () { pickSpace(c.id); } }; }))
      .concat([{ label: t('Companies') + '…', run: function () { A.go('#/companies'); } }]);
    A.menu(t('Work in'), items);
  }

  // ---- public gallery
  var gal = { modules: null, materials: null };
  function loadGallery(kind) {
    return FB.getDocs(FB.query(FB.collection(db, 'gallery_' + kind), FB.orderBy('created', 'desc'), FB.limit(300))).then(function (q) {
      gal[kind] = q.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); })
        .sort(function (a, b) { return (b.official ? 1 : 0) - (a.official ? 1 : 0); });
      return gal[kind];
    });
  }
  function author() { return { uid: user.uid, name: user.displayName || (user.email || '').split('@')[0] }; }
  function shareModule(m, label, thumb) {
    var id = m.gallery_id || FB.doc(FB.collection(db, 'gallery_modules')).id;
    var data = { name: m.params.name || label || '', category: '', params: J(m.params), thumb: thumb || '', author: author(), official: false,
                 created: FB.serverTimestamp() };
    if (isDev() && m.gallery_official) { data.official = true; }
    return FB.setDoc(dref('gallery_modules/' + id), data).then(function () { m.gallery_id = id; A.persist(); A.toast(t('Shared to the public gallery')); gal.modules = null; });
  }
  function unshareModule(m) {
    return FB.deleteDoc(dref('gallery_modules/' + m.gallery_id)).then(function () { delete m.gallery_id; A.persist(); A.toast(t('Removed from the public gallery')); gal.modules = null; }, err);
  }
  function shareMaterial(e, url) {
    var id = e.gallery_id || FB.doc(FB.collection(db, 'gallery_materials')).id;
    var data = { name: e.name, brand: e.brand || '', color: e.color || '', sheet_l: e.sheet_l || 0, sheet_w: e.sheet_w || 0, tex_w: e.tex_w || 0, tex_h: e.tex_h || 0,
                 thick: (e.thick || []).map(function (x) { return { t: Number(x.t) }; }), texture: url || '', author: author(), official: false, created: FB.serverTimestamp() };
    return FB.setDoc(dref('gallery_materials/' + id), data).then(function () { gal.materials = null; return id; });
  }
  function unshareMaterial(id) { return FB.deleteDoc(dref('gallery_materials/' + id)).then(function () { gal.materials = null; }); }
  function galleryAdmin(kind, item, done) {
    if (!isDev() && item.author.uid !== user.uid) { return null; }
    return function () {
      A.menu(item.name, [
        isDev() ? { label: t(item.official ? 'Not official' : 'Mark official'), run: function () {
          FB.updateDoc(dref('gallery_' + kind + '/' + item.id), { official: !item.official }).then(function () { gal[kind] = null; done(); }, err);
        } } : null,
        { label: t('Remove from gallery'), danger: true, run: function () {
          if (!confirm(t('Remove this item from the public gallery?'))) { return; }
          FB.deleteDoc(dref('gallery_' + kind + '/' + item.id)).then(function () { gal[kind] = null; done(); }, err);
        } }
      ].filter(Boolean));
    };
  }

  // ---- the public gallery as its own page (desktop sidebar): modules; materials are a tab of Materials
  function renderGalleryPage() {
    A.show(header(t('Public gallery')) + '<div class="page page-wide">' +
      '<div class="seg mat-tabs"><button type="button" class="on">' + esc(A.lang() === 'es' ? 'Módulos' : 'Modules') + '</button>' +
      '<button type="button" id="galMats">' + esc(A.lang() === 'es' ? 'Materiales' : 'Materials') + '</button></div>' +
      '<div class="cards" id="galGrid"><p class="meta-line">…</p></div></div>');
    backBtn('#/');
    $('#galMats').onclick = function () { A.go('#/materials/gallery'); };
    loadGallery('modules').then(function (list) {
      var el = $('#galGrid'); if (!el) { return; }
      el.innerHTML = list.length ? list.map(function (g) {
        return '<div class="mcard gcard"><button type="button" class="gpick" data-gal="' + esc(g.id) + '"><img class="pic" alt="" src="' + esc(g.thumb || '') + '">' +
          '<span class="nm">' + (g.official ? '<b class="badge">' + esc(t('Official')) + '</b> ' : '') + esc(g.name) + '</span>' +
          '<span class="sz">' + esc(t('Shared by: ') + (g.author && g.author.name || '')) + '</span></button>' +
          (galleryAdmin('modules', g, renderGalleryPage) ? '<button type="button" class="gmore" data-gmore="' + esc(g.id) + '" aria-label="⋯">⋯</button>' : '') + '</div>';
      }).join('') : '<p class="meta-line">' + esc(t('Nothing shared yet.')) + '</p>';
      el.querySelectorAll('[data-gal]').forEach(function (b) {
        b.onclick = function () {
          var sites = A.sites().slice().sort(function (a, c) { return a.updated < c.updated ? 1 : -1; });
          if (!sites.length) { A.toast(A.t('No sites yet')); return; }
          A.menu(A.t('Add to site'), sites.slice(0, 12).map(function (st) {
            return { label: st.name, run: function () { A.go('#/site/' + encodeURIComponent(st.id) + '/new/' + encodeURIComponent('gal:' + b.getAttribute('data-gal'))); } };
          }));
        };
      });
      el.querySelectorAll('[data-gmore]').forEach(function (b) {
        b.onclick = function () { var g = list.find(function (x) { return x.id === b.getAttribute('data-gmore'); }); galleryAdmin('modules', g, renderGalleryPage)(); };
      });
    }, function (e) { var el = $('#galGrid'); if (el) { el.innerHTML = '<p class="warn-line">' + esc(e.code || e.message) + '</p>'; } });
  }

  // ---- developer
  function renderDev() {
    if (!isDev()) { A.go('#/', true); return; }
    var c = JSON.parse(JSON.stringify(appCfg)); c.paypal = c.paypal || { mode: 'sandbox', plans: {} }; c.paypal.plans = c.paypal.plans || {};
    c.tiers = Object.assign({}, JSON.parse(JSON.stringify(TIERS)), c.tiers || {});
    var plans = Object.keys(c.paypal.plans);
    A.show(header(t('Developer')) + '<div class="page">' +
      '<div class="box fields"><h3 class="grp">PayPal</h3>' +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('PayPal client ID')) + '</span><input class="text-in" id="dvCid" value="' + esc(c.paypal.client_id || '') + '"></div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('PayPal mode')) + '</span><select id="dvMode" class="text-in" style="max-width:180px"><option value="sandbox">' + esc(t('Sandbox (tests)')) + '</option><option value="live"' + (c.paypal.mode === 'live' ? ' selected' : '') + '>' + esc(t('Live')) + '</option></select></div>' +
        '<h3 class="grp">' + esc(t('PayPal plans')) + '</h3>' +
        '<div id="dvPlans">' + plans.map(function (k, i) { return planRow(k, c.paypal.plans[k], i); }).join('') + '</div>' +
        '<button type="button" class="btn small" id="dvAddPlan" style="width:100%;margin-top:6px">' + esc(t('+ Plan')) + '</button></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Tier switches')) + '</h3><table class="tiers"><tr><th></th>' +
        ['web', 'plugin', 'materials', 'gallery'].map(function (f) { return '<th>' + esc(t(f)) + '</th>'; }).join('') + '</tr>' +
        ['web', 'lite', 'full'].map(function (tr) {
          return '<tr><th>' + TIER_NAME[tr] + '</th>' + ['web', 'plugin', 'materials', 'gallery'].map(function (f) {
            return '<td><input type="checkbox" data-tier="' + tr + ':' + f + '"' + (c.tiers[tr][f] ? ' checked' : '') + '></td>';
          }).join('') + '</tr>';
        }).join('') + '</table></div>' +
      '<button type="button" class="btn primary" id="dvSave" style="width:100%">' + esc(A.t('Save changes')) + '</button>' +
      '<div class="box fields" style="margin-top:16px"><h3 class="grp">' + esc(t('Give a plan')) + '</h3>' +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('User email')) + '</span><input class="text-in" id="gpMail" type="email"></div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Plan')) + '</span><select id="gpTier" class="text-in" style="max-width:180px"><option value="full">Full</option><option value="web">Web</option><option value="lite">Plugin Lite</option></select></div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Days')) + '</span><input class="text-in" id="gpDays" type="number" value="365" style="max-width:120px"></div>' +
        '<button type="button" class="btn small" id="gpGo" style="width:100%">' + esc(t('Give a plan')) + '</button></div>' +
      '</div>');
    backBtn('#/account');
    function planRow(k, p, i) {
      return '<div class="dv-plan" data-row="' + i + '"><input class="text-in" data-f="id" placeholder="P-…" value="' + esc(k) + '">' +
        '<select class="text-in" data-f="tier">' + ['web', 'lite', 'full'].map(function (x) { return '<option value="' + x + '"' + (p.tier === x ? ' selected' : '') + '>' + TIER_NAME[x] + '</option>'; }).join('') + '</select>' +
        '<select class="text-in" data-f="period"><option value="month">' + esc(t('monthly')) + '</option><option value="year"' + (p.period === 'year' ? ' selected' : '') + '>' + esc(t('yearly')) + '</option></select>' +
        '<input class="text-in" data-f="price" placeholder="US$9" value="' + esc(p.price || '') + '"><button type="button" class="xbtn" data-rm>✕</button></div>';
    }
    $('#dvAddPlan').onclick = function () {
      var d = document.createElement('div'); d.innerHTML = planRow('', { tier: 'full', period: 'month' }, Date.now());
      $('#dvPlans').appendChild(d.firstChild);
    };
    $('#dvPlans').onclick = function (e) { if (e.target.hasAttribute('data-rm')) { e.target.parentNode.remove(); } };
    $('#dvSave').onclick = function () {
      var out = { paypal: { client_id: $('#dvCid').value.trim(), mode: $('#dvMode').value, plans: {} }, tiers: {} };
      document.querySelectorAll('.dv-plan').forEach(function (r) {
        var g = function (f) { return r.querySelector('[data-f="' + f + '"]').value.trim(); };
        if (g('id')) { out.paypal.plans[g('id')] = { tier: g('tier'), period: g('period'), price: g('price') }; }
      });
      ['web', 'lite', 'full'].forEach(function (tr) { out.tiers[tr] = {}; });
      document.querySelectorAll('[data-tier]').forEach(function (cb) { var a = cb.getAttribute('data-tier').split(':'); out.tiers[a[0]][a[1]] = cb.checked; });
      FB.updateDoc(dref('config/app'), out).then(function () { A.toast(t('Saved')); }, err);
    };
    $('#gpGo').onclick = function () {
      var mail = $('#gpMail').value.trim().toLowerCase(), days = Number($('#gpDays').value) || 0;
      FB.getDocs(FB.query(FB.collection(db, 'users'), FB.where('email', '==', mail))).then(function (q) {
        if (!q.size) { A.toast(t('No user with that email (they must sign in once).')); return; }
        return FB.updateDoc(q.docs[0].ref, { plan: $('#gpTier').value, plan_until: FB.Timestamp.fromMillis(Date.now() + days * DAY), plan_status: 'given' })
          .then(function () { A.toast(t('Plan given')); });
      }).catch(err);
    };
  }

  // ------------------------------------------------------------------ routing hook (app.js asks first)
  function route(p) {
    if (!ON) { return false; }
    if (!user) { renderSignIn(); return true; }
    if (!account) { A.showLoading(t('Loading your data…')); return true; }
    if (p[0] === 'link' && p[1]) { renderLink(p[1]); return true; }
    if (p[0] === 'account') { renderAccount(); return true; }
    if (p[0] === 'plans') { renderPlans(); return true; }
    if (p[0] === 'dev') { renderDev(); return true; }
    if (!canWeb()) { renderPlans(); return true; }
    if (!space || !started) { A.showLoading(t('Loading your data…')); return true; }
    if (p[0] === 'companies') { renderCompanies(); return true; }
    if (p[0] === 'gallery') { renderGalleryPage(); return true; }
    if (p[0] === 'company' && p[1]) { renderCompany(p[1]); return true; }
    return false;
  }

  window.PPCloud = {
    on: ON, t: t, start: start, route: route,
    sitesChanged: function (arr) { if (ON && started) { sitesChanged(arr); } },
    prefsChanged: function (p) { if (ON && started) { prefsChanged(p); } },
    materialsChanged: function (list) { if (ON && started) { materialsChanged(list); } },
    texturePut: texturePut, textureDel: textureDel,
    langChanged: function (l) {
      if (ON && user && account && (!account.prefs || account.prefs.lang !== l)) {
        FB.updateDoc(dref('users/' + user.uid), { 'prefs.lang': l }).catch(function () {});
      }
    },
    user: function () { return user; }, space: function () { return space; }, canEdit: function () { return !ON || canEdit(); },
    isDev: isDev, invitesHtml: function () { return ON ? invitesHtml() : ''; }, wireInvites: wireInvites,
    spaceMenu: spaceMenu, moveSite: moveSite, hasCompanies: function () { return companies.length > 0; },
    gallery: { load: loadGallery, cached: function (k) { return gal[k]; }, shareModule: shareModule, unshareModule: unshareModule,
               shareMaterial: shareMaterial, unshareMaterial: unshareMaterial, admin: galleryAdmin },
    planLine: planLine
  };
})();
