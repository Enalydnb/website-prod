// js/richtext.js · shared by admin.html (editor) and index.html (About text)
// Cleans formatted text so only safe, on-brand formatting is kept:
//   bold, italic, underline, 4 text sizes, bullet + numbered lists, paragraphs, line breaks.
// Everything else (fonts, colours, links, scripts, styles pasted from Word …) is removed.
(function () {
  const SIZE_FROM_FONT = { 1: 'fs-s', 2: 'fs-s', 3: '', 4: 'fs-l', 5: 'fs-l', 6: 'fs-xl', 7: 'fs-xl' };
  const SIZE_CLASSES = ['fs-s', 'fs-l', 'fs-xl'];
  const BLOCKS = /^(P|DIV|H[1-6]|BLOCKQUOTE|SECTION|ARTICLE|HEADER|FOOTER)$/;

  function sizeClassOf(el) {
    if (el.nodeName === 'FONT' && el.getAttribute('size')) return SIZE_FROM_FONT[parseInt(el.getAttribute('size'), 10)] || '';
    const cls = [...(el.classList || [])].find(c => SIZE_CLASSES.includes(c));
    return cls || '';
  }

  // Copies allowed formatting from `src` into `dest` (both DOM nodes)
  function copyClean(src, dest, doc) {
    src.childNodes.forEach(n => {
      if (n.nodeType === 3) { dest.appendChild(doc.createTextNode(n.nodeValue)); return; }
      if (n.nodeType !== 1) return;
      const tag = n.nodeName;
      if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|TEMPLATE|META|LINK|IMG|SVG|VIDEO|AUDIO)$/.test(tag)) return;

      let out = null;
      const st = n.style || {};
      if (tag === 'BR') { dest.appendChild(doc.createElement('br')); return; }
      if (tag === 'B' || tag === 'STRONG' || st.fontWeight === 'bold' || parseInt(st.fontWeight, 10) >= 600) out = doc.createElement('b');
      else if (tag === 'I' || tag === 'EM' || st.fontStyle === 'italic') out = doc.createElement('i');
      else if (tag === 'U' || /underline/.test(st.textDecoration || st.textDecorationLine || '')) out = doc.createElement('u');
      else if (tag === 'UL' || tag === 'OL' || tag === 'LI') out = doc.createElement(tag.toLowerCase());
      else if (BLOCKS.test(tag)) out = doc.createElement('p');

      const size = sizeClassOf(n);
      if (size) {
        const span = doc.createElement('span');
        span.className = size;
        if (out && out.nodeName !== 'P' && out.nodeName !== 'LI' && out.nodeName !== 'UL' && out.nodeName !== 'OL') {
          span.appendChild(out); dest.appendChild(span); copyClean(n, out, doc); return;
        }
        if (!out) { dest.appendChild(span); copyClean(n, span, doc); return; }
        out.className = size;
      }
      if (!out) { copyClean(n, dest, doc); return; } // unknown tag → keep its text only
      dest.appendChild(out);
      copyClean(n, out, doc);
    });
  }

  // Wrap loose text at top level into paragraphs, drop empty blocks, flatten nested paragraphs
  function normalise(root, doc) {
    const out = doc.createElement('div');
    let loose = null;
    const flush = () => { if (loose && loose.textContent.trim()) out.appendChild(loose); loose = null; };
    root.childNodes.forEach(n => {
      const tag = n.nodeName;
      if (tag === 'P' || tag === 'UL' || tag === 'OL') {
        flush();
        if (tag === 'P' && n.querySelector('p, ul, ol')) { out.appendChild(normaliseInner(n, doc)); return; }
        if (n.textContent.trim() || n.querySelector('li')) out.appendChild(n.cloneNode(true));
      } else if (tag === 'LI') {
        flush();
        const ul = doc.createElement('ul'); ul.appendChild(n.cloneNode(true)); out.appendChild(ul);
      } else {
        if (!loose) loose = doc.createElement('p');
        loose.appendChild(n.cloneNode(true));
      }
    });
    flush();
    // trim <br> at the start/end of paragraphs
    out.querySelectorAll('p, li').forEach(p => {
      while (p.firstChild && p.firstChild.nodeName === 'BR') p.removeChild(p.firstChild);
      while (p.lastChild && p.lastChild.nodeName === 'BR') p.removeChild(p.lastChild);
    });
    return out;
  }
  function normaliseInner(p, doc) {
    const frag = doc.createDocumentFragment();
    normalise(p, doc).childNodes.forEach(c => frag.appendChild(c.cloneNode(true)));
    return frag;
  }

  function sanitize(html) {
    const doc = document.implementation.createHTMLDocument('');
    const src = doc.createElement('div');
    src.innerHTML = String(html || '');
    const clean = doc.createElement('div');
    copyClean(src, clean, doc);
    return normalise(clean, doc).innerHTML;
  }

  function escapeHtml(text) {
    return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Old content.json stored plain text (one paragraph per line) → still supported
  function isHtml(text) { return /<\/?(p|b|i|u|br|ul|ol|li|span|strong|em|div)\b/i.test(String(text || '')); }
  function toHtml(text) {
    if (isHtml(text)) return sanitize(text);
    return String(text || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => '<p>' + escapeHtml(l) + '</p>').join('');
  }

  window.EnalyRich = { sanitize, toHtml, isHtml };
})();
