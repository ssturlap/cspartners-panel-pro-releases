/* CSPARTNERS PANEL PRO — full text on hover wherever text is cut off (… or clipped), in the
 * plugin's windows and in PanelPro Web. Shared; loaded by every page. Nothing to call.
 * A text is cut off when the element (or its text field) is narrower / shorter than its text and
 * hides the rest (overflow hidden / ellipsis / line clamp). Elements with their own title or
 * data-tip keep theirs. */
(function () {
  'use strict';
  if (window.PPFullText) { return; }
  var tip = null, timer = 0, cur = null;

  function style() {
    if (document.getElementById('ft-css')) { return; }
    var s = document.createElement('style');
    s.id = 'ft-css';
    s.textContent = '.ft-tip{position:fixed;z-index:10000;max-width:min(420px,90vw);padding:6px 9px;border-radius:7px;background:#24221f;color:#fff;' +
      'font:600 12px/1.35 -apple-system,"Segoe UI",Inter,Roboto,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25);pointer-events:none;white-space:pre-wrap;word-break:break-word;' +
      'opacity:0;transform:translateY(3px);transition:opacity .1s,transform .1s}.ft-tip.on{opacity:1;transform:none}';
    document.head.appendChild(s);
  }

  function textOf(el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { return el.value; }
    return (el.innerText || el.textContent || '').replace(/\s+\n/g, '\n').trim();
  }

  function clipped(el) {
    if (!el || el.nodeType !== 1 || el.title || el.hasAttribute('data-tip') || el.tagName === 'SELECT' || el.tagName === 'svg') { return false; }
    if (el.tagName === 'INPUT' && !/^(text|search|)$/.test(el.type)) { return false; }
    var w = el.clientWidth, h = el.clientHeight;
    if (!w || !textOf(el)) { return false; }
    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.children.length > 3) { return false; }   // a list or a bar, not a text
    var cs = getComputedStyle(el);
    if (/auto|scroll/.test(cs.overflowX + cs.overflowY) && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') { return false; }   // scrolls: nothing hidden
    var hides = cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.textOverflow === 'ellipsis' || cs.webkitLineClamp !== 'none' && cs.webkitLineClamp;
    if (!hides && el.tagName !== 'INPUT') { return false; }
    return el.scrollWidth > w + 1 || (cs.whiteSpace !== 'nowrap' && el.scrollHeight > h + 2 && el.tagName !== 'INPUT');
  }

  function find(t) {
    var el = t, n = 0;
    while (el && el !== document.body && n < 4) {
      if (clipped(el)) { return el; }
      if (el.title || el.hasAttribute && el.hasAttribute('data-tip')) { return null; }
      el = el.parentElement; n++;
    }
    return null;
  }

  function show(el) {
    style();
    if (!tip) { tip = document.createElement('div'); tip.className = 'ft-tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
    tip.textContent = textOf(el);
    tip.classList.remove('on');
    tip.style.left = '0px'; tip.style.top = '0px';
    var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.max(6, Math.min(r.left, window.innerWidth - tw - 6));
    var y = r.bottom + 6;
    if (y + th > window.innerHeight - 6) { y = Math.max(6, r.top - th - 6); }
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    requestAnimationFrame(function () { if (tip) { tip.classList.add('on'); } });
  }
  function hide() { clearTimeout(timer); cur = null; if (tip) { tip.classList.remove('on'); } }

  document.addEventListener('mouseover', function (e) {
    var el = find(e.target);
    if (el === cur) { return; }
    hide();
    if (!el) { return; }
    cur = el;
    timer = setTimeout(function () { if (cur === el && el.isConnected) { show(el); } }, 350);
  }, true);
  document.addEventListener('mouseout', function (e) { if (cur && (!e.relatedTarget || !cur.contains(e.relatedTarget))) { hide(); } }, true);
  ['scroll', 'mousedown', 'keydown', 'blur'].forEach(function (ev) { window.addEventListener(ev, hide, true); });

  window.PPFullText = { hide: hide };
})();
