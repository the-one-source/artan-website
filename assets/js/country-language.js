/* =========================================================
   country-language.js
   SINGLE SOURCE OF TRUTH — DROP-IN REPLACEMENT

   Responsibilities
   - Footer locale UI (country label + language toggle dropdown)
   - Country overlay open/close + selection
   - Session-first IP detection (new session => IP, same session => stored)
   - Calls translation engine via window.ARTAN_TRANSLATION.applyLanguage(lang)

   Guarantees
   - No duplicate event bindings
   - No regressions to menu/theme/cursor systems
   - Preserves existing micro-behaviors (CSS owns motion)
========================================================= */
(() => {
  'use strict';

  const STORAGE = {
    COUNTRY_CODE: 'artan_country_code',
    COUNTRY_LABEL: 'artan_country_label',
    LANGUAGE: 'artan_language',
    SESSION: 'artan_session',
    COUNTRY_CACHE: 'artan_country_cache_v1'
  };

  const DEFAULT_COUNTRY_CODE = 'DE';
  const DEFAULT_LANGUAGE = 'en';

  // Normalize language codes to ISO-639-1 where possible.
  // restcountries.com often returns ISO-639-3 keys (e.g. "fas"); translations use ISO-639-1 (e.g. "fa").
  const ISO639_3_TO_1 = {
    ara: 'ar', bel: 'be', ben: 'bn', bul: 'bg', ces: 'cs', cmn: 'zh', dan: 'da',
    deu: 'de', ell: 'el', eng: 'en', est: 'et', fas: 'fa', fin: 'fi', fra: 'fr',
    heb: 'he', hin: 'hi', hrv: 'hr', hun: 'hu', ind: 'id', ita: 'it', jpn: 'ja',
    kaz: 'kk', kor: 'ko', lav: 'lv', lit: 'lt', msa: 'ms', nld: 'nl', nor: 'no',
    pol: 'pl', por: 'pt', ron: 'ro', rus: 'ru', slk: 'sk', slv: 'sl', spa: 'es',
    srp: 'sr', swe: 'sv', tam: 'ta', tel: 'te', tha: 'th', tur: 'tr', ukr: 'uk',
    urd: 'ur', vie: 'vi', zho: 'zh'
  };

  const normalizeLang = (code) => {
    const raw = String(code || '').trim();
    if (!raw) return DEFAULT_LANGUAGE;
    let c = raw.split('-')[0].toLowerCase();
    if (c.length === 3 && ISO639_3_TO_1[c]) c = ISO639_3_TO_1[c];
    if (!c || c.length < 2) return DEFAULT_LANGUAGE;
    return c;
  };

  const qs = (s) => document.querySelector(s);

  const getLS = (k) => {
    try { return localStorage.getItem(k); } catch { return null; }
  };

  const setLS = (k, v) => {
    try { localStorage.setItem(k, v); } catch {}
  };

  const cache = (() => {
    try { return JSON.parse(getLS(STORAGE.COUNTRY_CACHE) || '{}') || {}; }
    catch { return {}; }
  })();

  const saveCache = () => {
    try { setLS(STORAGE.COUNTRY_CACHE, JSON.stringify(cache)); } catch {}
  };

  const state = {
    countryCode: null,
    countryLabel: null,
    language: DEFAULT_LANGUAGE
  };

  // Expose read-only state for debugging without coupling.
  Object.defineProperty(window, 'ARTAN_LOCALE', {
    configurable: true,
    get: () => ({ ...state })
  });

  /* =================== UI: Labels =================== */

  const nativeCountryName = (countryCode, langCode) => {
    try {
      const dn = new Intl.DisplayNames([langCode], { type: 'region' });
      return dn.of(countryCode) || countryCode;
    } catch {
      return countryCode;
    }
  };

  const setLabels = () => {
    const countryEl = qs('#current-country');
    const langEl = qs('#current-language');

    if (countryEl) countryEl.textContent = state.countryLabel || '—';
    if (langEl) langEl.textContent = (state.language || DEFAULT_LANGUAGE).toUpperCase();
  };

  /* =================== Translation Bridge (safe + retry + fallback) =================== */

  let pendingLang = null;

  const applyTranslationNow = (lang) => {
    const api = window.ARTAN_TRANSLATION;
    if (!api || typeof api.applyLanguage !== 'function') return false;

    try {
      const out = api.applyLanguage(normalizeLang(lang));
      if (out === false) return false;
      return true;
    } catch {
      return false;
    }
  };

  const forceEnglishFallback = () => {
    state.language = DEFAULT_LANGUAGE;
    setLS(STORAGE.LANGUAGE, DEFAULT_LANGUAGE);
    setLabels();
    buildLanguageDropdown(DEFAULT_LANGUAGE);
    applyTranslationNow(DEFAULT_LANGUAGE);
  };

  const applyTranslation = (lang) => {
    const normalized = normalizeLang(lang);
    pendingLang = normalized;

    if (applyTranslationNow(normalized)) {
      pendingLang = null;
      return;
    }

    // Retry briefly (translation.js may initialize after this file).
    let tries = 0;
    const t = setInterval(() => {
      tries += 1;
      if (!pendingLang) { clearInterval(t); return; }

      if (applyTranslationNow(pendingLang)) {
        pendingLang = null;
        clearInterval(t);
        return;
      }

      // After retries, keep UI consistent by falling back to English.
      if (tries >= 30) {
        pendingLang = null;
        clearInterval(t);
        forceEnglishFallback();
      }
    }, 80);
  };

  /* =================== Overlay: Country =================== */

  const openCountryOverlay = () => {
    const o = qs('#country-overlay');
    if (!o) return;
    o.classList.add('visible');
  };

  const closeCountryOverlay = () => {
    const o = qs('#country-overlay');
    if (!o) return;
    o.classList.remove('visible');
  };

  /* =================== Dropdown: Language =================== */

  const closeLanguageDropdown = () => {
    const dd = qs('#language-dropdown');
    const toggle = qs('#language-toggle');
    if (!dd) return;
    dd.classList.remove('visible');
    dd.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };

  const openLanguageDropdown = () => {
    const dd = qs('#language-dropdown');
    const toggle = qs('#language-toggle');
    if (!dd) return;
    dd.classList.add('visible');
    dd.setAttribute('aria-hidden', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  };

  const toggleLanguageDropdown = () => {
    const dd = qs('#language-dropdown');
    if (!dd) return;
    const isOpen = dd.classList.contains('visible');
    if (isOpen) closeLanguageDropdown();
    else openLanguageDropdown();
  };

  let languageDocCloserBound = false;

  const buildLanguageDropdown = (primaryLang) => {
    const dd = qs('#language-dropdown');
    const toggle = qs('#language-toggle');
    if (!dd || !toggle) return;

    dd.innerHTML = '';
    dd.setAttribute('aria-hidden', 'true');
    dd.classList.remove('visible');

    const langs = Array.from(new Set([
      normalizeLang(primaryLang),
      DEFAULT_LANGUAGE
    ].filter(Boolean)));

    langs.forEach((code) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'language-option';
      btn.setAttribute('data-lang', code);
      btn.textContent = code.toUpperCase();
      btn.addEventListener('click', () => {
        state.language = code;
        setLS(STORAGE.LANGUAGE, code);
        closeLanguageDropdown();
        setLabels();
        applyTranslation(code);

        // Keep country label native to current language.
        if (state.countryCode) {
          state.countryLabel = nativeCountryName(state.countryCode, state.language);
          setLS(STORAGE.COUNTRY_LABEL, state.countryLabel);
          setLabels();
        }
      });
      dd.appendChild(btn);
    });

    // Bind toggle once (replace handler cleanly)
    toggle.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleLanguageDropdown();
    };

    toggle.setAttribute('aria-haspopup', 'listbox');
    toggle.setAttribute('aria-expanded', 'false');

    if (!languageDocCloserBound) {
      languageDocCloserBound = true;
      document.addEventListener('click', (e) => {
        const inside = e.target && (e.target.closest('#language-toggle') || e.target.closest('#language-dropdown'));
        if (!inside) closeLanguageDropdown();
      }, { passive: true });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLanguageDropdown();
      });
    }
  };

  /* =================== IP Detection (new session) =================== */

  async function detectIP() {
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();

      const code = d && d.country_code ? String(d.country_code).toUpperCase() : null;

      let lang = DEFAULT_LANGUAGE;
      // ipapi.co often returns languages like: "de-DE,en-US,en" (comma-separated)
      if (d && typeof d.languages === 'string' && d.languages.trim()) {
        lang = normalizeLang(d.languages.split(',')[0].trim());
      } else if (d && typeof d.language === 'string' && d.language.trim()) {
        lang = normalizeLang(d.language);
      }

      return { code, lang };
    } catch {
      return { code: null, lang: DEFAULT_LANGUAGE };
    }
  }

  /* =================== Country Resolve (fallback) =================== */

  async function resolveCountryFromName(name) {
    const key = String(name || '').trim();
    if (!key) return null;

    if (cache[key]) return cache[key];

    try {
      const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(key)}?fields=cca2,languages`;
      const r = await fetch(url);
      const arr = await r.json();
      const item = Array.isArray(arr) ? arr[0] : null;
      if (!item) return null;

      const code = item.cca2 ? String(item.cca2).toUpperCase() : null;

      let lang = DEFAULT_LANGUAGE;
      if (item.languages && typeof item.languages === 'object') {
        const firstKey = Object.keys(item.languages)[0];
        if (firstKey) lang = normalizeLang(firstKey);
      }

      const out = { code, lang };
      cache[key] = out;
      saveCache();
      return out;
    } catch {
      return null;
    }
  }

  /* =================== Bindings =================== */

  const bindFooterTriggers = () => {
    const countryBtn = qs('#country-selector');
    if (countryBtn) {
      countryBtn.onclick = (e) => {
        e.preventDefault();
        closeLanguageDropdown();
        openCountryOverlay();
      };
    }
  };

  const bindOverlayClose = () => {
    const closeBtn = qs('#country-overlay-close');
    if (closeBtn) closeBtn.onclick = closeCountryOverlay;

    const overlay = qs('#country-overlay');
    if (overlay && !overlay.__artanBackdropBound) {
      overlay.__artanBackdropBound = true;
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCountryOverlay();
      }, { passive: true });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCountryOverlay();
      });
    }
  };

  const bindCountrySelection = () => {
    const regions = qs('#country-regions');
    if (!regions || regions.__artanBound) return;
    regions.__artanBound = true;

    regions.addEventListener('click', async (e) => {
      const target = e.target;
      const btn = target && target.closest ? target.closest('.country-option') : null;
      if (!btn) return;

      const attrCode = btn.getAttribute('data-country-code') || btn.getAttribute('data-code') || btn.getAttribute('data-cca2');
      const attrLang = btn.getAttribute('data-language') || btn.getAttribute('data-lang');

      const selectedName = btn.getAttribute('data-country') || btn.getAttribute('data-name') || btn.textContent || '';
      const selectedLabel = btn.textContent || selectedName;

      let code = attrCode ? String(attrCode).toUpperCase() : null;
      let lang = attrLang ? normalizeLang(attrLang) : null;

      if (!code || !lang) {
        const resolved = await resolveCountryFromName(selectedName);
        if (!code) code = resolved && resolved.code ? resolved.code : (state.countryCode || DEFAULT_COUNTRY_CODE);
        if (!lang) lang = resolved && resolved.lang ? normalizeLang(resolved.lang) : DEFAULT_LANGUAGE;
      }

      state.countryCode = String(code || DEFAULT_COUNTRY_CODE).toUpperCase();
      state.language = normalizeLang(lang || DEFAULT_LANGUAGE);
      state.countryLabel = nativeCountryName(state.countryCode, state.language) || selectedLabel;

      setLS(STORAGE.COUNTRY_CODE, state.countryCode);
      setLS(STORAGE.COUNTRY_LABEL, state.countryLabel);
      setLS(STORAGE.LANGUAGE, state.language);

      closeCountryOverlay();
      closeLanguageDropdown();
      setLabels();
      buildLanguageDropdown(state.language);
      applyTranslation(state.language);
    }, { passive: true });
  };

  /* =================== Init =================== */

  async function init() {
    const isNewSession = !sessionStorage.getItem(STORAGE.SESSION);

    if (isNewSession) {
      const ip = await detectIP();

      const code = (ip.code || DEFAULT_COUNTRY_CODE).toUpperCase();
      const lang = normalizeLang(ip.lang || DEFAULT_LANGUAGE);

      state.countryCode = code;
      state.language = lang;
      state.countryLabel = nativeCountryName(code, lang);

      setLS(STORAGE.COUNTRY_CODE, code);
      setLS(STORAGE.COUNTRY_LABEL, state.countryLabel);
      setLS(STORAGE.LANGUAGE, lang);

      sessionStorage.setItem(STORAGE.SESSION, '1');
    } else {
      state.countryCode = (getLS(STORAGE.COUNTRY_CODE) || DEFAULT_COUNTRY_CODE).toUpperCase();
      state.language = normalizeLang(getLS(STORAGE.LANGUAGE) || DEFAULT_LANGUAGE);
      state.countryLabel = getLS(STORAGE.COUNTRY_LABEL) || nativeCountryName(state.countryCode, state.language);
    }

    bindFooterTriggers();
    bindOverlayClose();
    bindCountrySelection();

    setLabels();
    buildLanguageDropdown(state.language);
    applyTranslation(state.language);
  }

  // Defer-safe init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();