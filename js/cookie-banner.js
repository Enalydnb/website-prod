// 1. CSS Styles im Dark/Neon-Pink Design einfügen
const cookieStyles = `
  .cookie-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); z-index: 2000; display: none; justify-content: center; align-items: center; padding: 1.5rem; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  }
  .cookie-overlay.show { display: flex; }
  .cookie-modal {
    background: #0E0E10; color: #F2F2F2; width: 100%; max-width: 520px; padding: 2.25rem 2rem; font-family: 'Manrope', sans-serif; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); box-sizing: border-box;
  }
  .cookie-modal * { box-sizing: border-box; }
  .cookie-screen { display: none; }
  .cookie-screen.active { display: block; }
  .cookie-modal h2 {
    font-family: 'League Gothic', sans-serif; font-size: 2.2rem; font-weight: 400; color: #F2F2F2; margin-bottom: 1rem; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0;
  }
  .cookie-modal-text { font-size: 0.85rem; line-height: 1.6; color: #cccccc; text-align: left; margin-bottom: 1.5rem; font-weight: 300; }
  .cookie-modal-text a { color: #F2F2F2; text-decoration: underline; text-decoration-color: #FF006E; }
  .cookie-checkboxes { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1.5rem; font-size: 0.85rem; font-weight: 500; flex-wrap: wrap; }
  .cookie-checkboxes label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; color: #F2F2F2; }
  .cookie-checkboxes input[type="checkbox"] { accent-color: #FF006E; width: 16px; height: 16px; }
  .cookie-modal-btns { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
  .btn-cookie-modal {
    background: #FF006E; color: #ffffff; border: 1px solid #FF006E; width: 100%; padding: 0.65rem 1rem; font-size: 1.2rem; font-family: 'League Gothic', sans-serif; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, color 0.2s; border-radius: 4px;
  }
  .btn-cookie-modal:hover { background: transparent; color: #F2F2F2; }
  .btn-cookie-modal.btn-secondary {
    background: transparent; color: #F2F2F2; border: 1px solid rgba(255, 255, 255, 0.15);
  }
  .btn-cookie-modal.btn-secondary:hover { border-color: #FF006E; color: #FF006E; }
  .cookie-detail-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 0.5rem; flex-wrap: wrap; }
  .cookie-detail-header-row .cookie-modal-btns-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .cookie-detail-header-row .cookie-modal-btns-row .btn-cookie-modal { width: auto; padding: 0.4rem 0.8rem; font-size: 1.1rem; }
  .btn-back { font-size: 0.85rem; color: #888888; cursor: pointer; transition: color 0.2s; }
  .btn-back:hover { color: #FF006E; text-decoration: underline; }
  .cookie-category-box { background: rgba(0, 0, 0, 0.4); padding: 1.25rem; margin-bottom: 1rem; text-align: left; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); }
  .cookie-cat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
  .cookie-cat-title { font-size: 0.95rem; font-weight: 600; color: #F2F2F2; }
  .cookie-cat-desc { font-size: 0.8rem; line-height: 1.5; color: #aaa; margin-bottom: 0.5rem; font-weight: 300; }
  .cookie-cat-toggle-link { font-size: 0.8rem; color: #FF006E; text-decoration: none; cursor: pointer; display: inline-block; margin-top: 0.25rem; }
  .cookie-cat-toggle-link:hover { text-decoration: underline; }
  .cookie-cat-details-content { display: none; font-size: 0.75rem; color: #ccc; background: rgba(0, 0, 0, 0.6); padding: 0.75rem; margin-top: 0.5rem; border-left: 2px solid #FF006E; line-height: 1.5; }
  .cookie-cat-details-content.open { display: block; }
  .cookie-cat-details-content a { color: #F2F2F2; text-decoration: underline; }
  .switch-wrapper { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #888888; }
  .switch { position: relative; display: inline-block; width: 40px; height: 22px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .3s; border-radius: 22px; }
  .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
  input:checked + .slider { background-color: #FF006E; }
  input:checked + .slider:before { transform: translateX(18px); }
  .switch input:disabled + .slider { background-color: #222; cursor: not-allowed; }
  .cookie-modal-footer { display: flex; justify-content: center; gap: 0.75rem; font-size: 0.75rem; color: #888888; }
  .cookie-modal-footer button, .cookie-modal-footer a { background: none; border: none; color: #888888; font-size: 0.75rem; cursor: pointer; text-decoration: none; font-family: inherit; padding: 0; }
  .cookie-modal-footer button:hover, .cookie-modal-footer a:hover { text-decoration: underline; color: #FF006E; }
`;

const styleEl = document.createElement('style');
styleEl.innerHTML = cookieStyles;
document.head.appendChild(styleEl);

// 2. HTML Struktur des Banners
const bannerHTML = `
  <div class="cookie-overlay" id="cookieBanner">
    <div class="cookie-modal">
      <div class="cookie-screen active" id="screenMain">
        <h2>Datenschutzeinstellungen</h2>
        <div class="cookie-modal-text">
          Wir nutzen essenzielle Techniken für den Betrieb dieser Website sowie optionale externe Medien (z. B. Musik-Player von SoundCloud und YouTube-Videos). Bei der Aktivierung externer Medien können Daten an Drittanbieter übertragen werden. Weitere Informationen finden Sie in unserer <a href="datenschutz">Datenschutzerklärung</a>.
        </div>
        <div class="cookie-checkboxes">
          <label><input type="checkbox" checked disabled> Essenziell</label>
          <label><input type="checkbox" id="mainExternalCheckbox"> Externe Medien</label>
        </div>
        <div class="cookie-modal-btns">
          <button class="btn-cookie-modal" id="btnMainAcceptAll">Alle akzeptieren</button>
          <button class="btn-cookie-modal btn-secondary" id="btnMainReject">Nur essenzielle akzeptieren</button>
          <button class="btn-cookie-modal btn-secondary" id="btnMainSave">Auswahl speichern</button>
          <button class="btn-cookie-modal btn-secondary id-settings-trigger">Individuelle Einstellungen</button>
        </div>
        <div class="cookie-modal-footer">
          <button class="id-settings-trigger">Cookie Details</button> | 
          <a href="datenschutz">Datenschutzerklärung</a> | 
          <a href="impressum">Impressum</a>
        </div>
      </div>

      <div class="cookie-screen" id="screenDetails">
        <h2>Datenschutzeinstellungen</h2>
        <div class="cookie-detail-header-row">
          <div class="cookie-modal-btns-row">
            <button class="btn-cookie-modal" id="btnDetailAcceptAll">Alle akzeptieren</button>
            <button class="btn-cookie-modal btn-secondary" id="btnDetailReject">Nur essenzielle</button>
            <button class="btn-cookie-modal btn-secondary" id="btnDetailSave">Speichern</button>
          </div>
          <span class="btn-back" id="btnBackToMain">Zurück</span>
        </div>
        <div class="cookie-category-box">
          <div class="cookie-cat-top">
            <span class="cookie-cat-title">Essenziell (1)</span>
            <div class="switch-wrapper">
              <span>Immer aktiv</span>
              <label class="switch">
                <input type="checkbox" checked disabled>
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <p class="cookie-cat-desc">Essenzielle Funktionen ermöglichen die Speicherung Ihrer Datenschutz-Einstellungen sowie die grundlegende Nutzung der Website.</p>
          <span class="cookie-cat-toggle-link" data-target="detailsEssential">Informationen anzeigen</span>
          <div class="cookie-cat-details-content" id="detailsEssential">
            <strong>Name:</strong> cookie_essential, cookie_external, cookiesAccepted<br>
            <strong>Zweck:</strong> Speichert die getroffenen Auswahlen der Privatsphäre-Einstellungen.<br>
            <strong>Rechtliche Infos:</strong> Alle Angaben finden Sie im <a href="impressum">Impressum</a>.
          </div>
        </div>

        <div class="cookie-category-box">
          <div class="cookie-cat-top">
            <span class="cookie-cat-title">Externe Medien</span>
            <div class="switch-wrapper">
              <span id="toggleStatusText">Aus</span>
              <label class="switch">
                <input type="checkbox" id="detailExternalSwitch">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <p class="cookie-cat-desc">Inhalte von Musik- und Videoplattformen werden standardmäßig blockiert. Bei Zustimmung werden diese Medien direkt geladen.</p>
          <span class="cookie-cat-toggle-link" data-target="detailsExternal">Informationen anzeigen</span>
          <div class="cookie-cat-details-content" id="detailsExternal">
            Bei Aktivierung werden Daten an externe Anbieter übermittelt:<br>
            • <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">YouTube (Google) Privacy Policy</a><br>
            • <a href="https://soundcloud.com/pages/privacy" target="_blank" rel="noopener">SoundCloud Privacy Policy</a>
          </div>
        </div>
        <div class="cookie-modal-footer" style="margin-top: 1.5rem;">
          <a href="datenschutz">Datenschutzerklärung</a> | <a href="impressum">Impressum</a>
        </div>
      </div>
    </div>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const div = document.createElement('div');
  div.innerHTML = bannerHTML;
  document.body.appendChild(div);

  const cookieBanner = document.getElementById('cookieBanner');
  const screenMain = document.getElementById('screenMain');
  const screenDetails = document.getElementById('screenDetails');
  const settingsTriggers = document.querySelectorAll('.id-settings-trigger');
  const btnBackToMain = document.getElementById('btnBackToMain');
  
  const mainExternalCheckbox = document.getElementById('mainExternalCheckbox');
  const detailExternalSwitch = document.getElementById('detailExternalSwitch');
  const toggleStatusText = document.getElementById('toggleStatusText');

  window.checkCookieConsent = function() {
    const externalConsent = localStorage.getItem('cookie_external');

    if (externalConsent === 'true') {
      loadExternalContent();
    } else {
      restrictExternalContent();
    }

    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => { cookieBanner.classList.add('show'); }, 500);
    }
  };

  document.querySelectorAll('.cookie-cat-toggle-link').forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('data-target');
      document.getElementById(targetId).classList.toggle('open');
    });
  });

  settingsTriggers.forEach(t => t.addEventListener('click', (e) => { 
    e.preventDefault();
    screenMain.classList.remove('active'); 
    screenDetails.classList.add('active'); 
  }));
  btnBackToMain.addEventListener('click', () => { 
    screenDetails.classList.remove('active'); 
    screenMain.classList.add('active'); 
  });

  mainExternalCheckbox.addEventListener('change', (e) => { 
    detailExternalSwitch.checked = e.target.checked; 
    toggleStatusText.textContent = e.target.checked ? "An" : "Aus"; 
  });
  detailExternalSwitch.addEventListener('change', (e) => { 
    mainExternalCheckbox.checked = e.target.checked; 
    toggleStatusText.textContent = e.target.checked ? "An" : "Aus"; 
  });

  function loadExternalContent() {
    document.querySelectorAll('.cookie-blocked-placeholder').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.cookie-lazy-iframe').forEach(iframe => {
      if(iframe.getAttribute('data-src')) {
        iframe.src = iframe.getAttribute('data-src');
      }
    });
  }

  function restrictExternalContent() {
    document.querySelectorAll('.cookie-blocked-placeholder').forEach(p => p.style.display = 'flex');
    document.querySelectorAll('.cookie-lazy-iframe').forEach(iframe => { iframe.removeAttribute('src'); });
  }

  window.savePreferences = function(externalAccepted) {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookie_essential', 'true');
    localStorage.setItem('cookie_external', externalAccepted ? 'true' : 'false');
    cookieBanner.classList.remove('show');
    window.checkCookieConsent();
  };

  window.enableExternalCookiesViaButton = function() {
    window.savePreferences(true);
  };

  document.getElementById('btnMainAcceptAll').addEventListener('click', () => window.savePreferences(true));
  document.getElementById('btnMainReject').addEventListener('click', () => window.savePreferences(false));
  document.getElementById('btnMainSave').addEventListener('click', () => window.savePreferences(mainExternalCheckbox.checked));
  
  document.getElementById('btnDetailAcceptAll').addEventListener('click', () => window.savePreferences(true));
  document.getElementById('btnDetailReject').addEventListener('click', () => window.savePreferences(false));
  document.getElementById('btnDetailSave').addEventListener('click', () => window.savePreferences(detailExternalSwitch.checked));

  window.reopenCookieBanner = function() {
    const isExternalAllowed = localStorage.getItem('cookie_external') === 'true';
    
    mainExternalCheckbox.checked = isExternalAllowed;
    detailExternalSwitch.checked = isExternalAllowed;
    toggleStatusText.textContent = isExternalAllowed ? "An" : "Aus";

    screenMain.classList.remove('active'); 
    screenDetails.classList.add('active'); 
    cookieBanner.classList.add('show');
  };

  window.checkCookieConsent();
});