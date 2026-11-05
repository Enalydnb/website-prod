// js/legal.js · renders the legal texts from data/imprint.json and data/privacy.json (edited in the admin dashboard)
//
// Text format (kept simple on purpose):
//   empty line        → new paragraph
//   line break        → line break
//   **text**          → bold
//   lines with "- "   → bullet list
//   e-mail addresses and https:// links become clickable automatically
(function () {
  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function inline(line) {
    let html = escapeHtml(line);
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // URLs (trailing punctuation stays outside the link)
    html = html.replace(/(https?:\/\/[^\s<]+?)([.,;:!?)]*)(?=\s|<|$)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>$2');
    // E-mail addresses
    html = html.replace(/(^|[\s(>])([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
      '$1<a href="mailto:$2">$2</a>');
    return html;
  }

  // Formatted text from the dashboard editor: clean it and make links/e-mails clickable
  const LINK_RE = /(https?:\/\/[^\s<]+?)([.,;:!?)]*)(?=\s|$)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  function linkify(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const text = node.nodeValue;
      LINK_RE.lastIndex = 0;
      if (!LINK_RE.test(text)) return;
      LINK_RE.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0, m;
      while ((m = LINK_RE.exec(text))) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const a = document.createElement('a');
        if (m[3]) { a.href = 'mailto:' + m[3]; a.textContent = m[3]; }
        else { a.href = m[1]; a.textContent = m[1]; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        frag.appendChild(a);
        if (m[2]) frag.appendChild(document.createTextNode(m[2]));
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }
  function renderHtml(html) {
    const box = document.createElement('div');
    box.innerHTML = window.EnalyRich ? EnalyRich.sanitize(html) : escapeHtml(String(html).replace(/<[^>]*>/g, ' '));
    linkify(box);
    return box.innerHTML;
  }

  function render(text) {
    if (window.EnalyRich && EnalyRich.isHtml(text)) return renderHtml(text);
    const blocks = String(text || '').replace(/\r\n?/g, '\n').split(/\n\s*\n/);
    return blocks.map(block => {
      const lines = block.split('\n').filter(l => l.trim() !== '');
      if (!lines.length) return '';
      if (lines.every(l => /^\s*-\s+/.test(l))) {
        return '<ul>' + lines.map(l => '<li>' + inline(l.replace(/^\s*-\s+/, '')) + '</li>').join('') + '</ul>';
      }
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('');
  }

  // key = 'imprint' → data/imprint.json, 'privacy' → data/privacy.json
  async function load(key) {
    try {
      const res = await fetch('data/' + key + '.json', { cache: 'no-cache' });
      if (!res.ok) return null;
      const data = await res.json();
      const sections = data && Array.isArray(data.sections) ? data.sections : [];
      const clean = sections.filter(s => s && (String(s.title || '').trim() || String(s.body || '').trim()));
      return clean.length ? clean : null;
    } catch (e) {
      return null; // keep the static text that is already in the page
    }
  }

  window.EnalyLegal = { render, load, escapeHtml };
})();
