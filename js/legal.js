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

  function render(text) {
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
