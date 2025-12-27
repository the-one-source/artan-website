/**
 * ============================================================
 * ARTAN TRANSLATION & REGION MODULE
 * Fully functional, maintainable, future-proof translation manager
 * - Translation caching and async Google Translate API
 * - EN toggle override, native country names
 * - Country overlay, menu overlay translation, announcement sync
 * ============================================================
 */

window.ARTAN_TRANSLATION = (function () {
    // ================================
    // Language & Region Mappings
    // ================================
    const LANGUAGE_STORAGE_KEY = "artan_language";
    const REGION_STORAGE_KEY = "artan_region";
    const EN_OVERRIDE_KEY = "artan_en_override";

    const REGION_LANGUAGE_MAP = {
        /* All countries mapped correctly to their main language */
        /* Africa, Middle East & India */
        "Algeria": "ar", "Angola": "pt", "Bahrain": "ar", "Botswana": "en", "Cameroon": "fr",
        "Egypt": "ar", "Ghana": "en", "India": "hi", "Iran": "fa", "Israel": "he",
        "Ivory Coast": "fr", "Jordan": "ar", "Kenya": "en", "Kuwait": "ar", "Lebanon": "ar",
        "Morocco": "ar", "Mozambique": "pt", "Namibia": "en", "Nigeria": "en", "Oman": "ar",
        "Pakistan": "ur", "Qatar": "ar", "Saudi Arabia": "ar", "Senegal": "fr", "South Africa": "en",
        "Tanzania": "sw", "Tunisia": "ar", "Turkey": "tr", "Uganda": "en", "United Arab Emirates": "ar",

        /* Asia Pacific */
        "Australia": "en", "Bangladesh": "bn", "Brunei": "ms", "Cambodia": "km", "China Mainland": "zh",
        "Hong Kong": "zh", "Indonesia": "id", "Japan": "ja", "Kazakhstan": "kk", "Macau": "zh",
        "Malaysia": "ms", "New Zealand": "en", "Philippines": "en", "Singapore": "en", "South Korea": "ko",
        "Sri Lanka": "si", "Taiwan": "zh", "Thailand": "th", "Vietnam": "vi",

        /* Europe */
        "Albania": "sq", "Andorra": "ca", "Armenia": "hy", "Austria": "de", "Azerbaijan": "az",
        "Belarus": "ru", "Belgium": "fr", "Bosnia and Herzegovina": "bs", "Bulgaria": "bg",
        "Croatia": "hr", "Cyprus": "el", "Czech Republic": "cs", "Denmark": "da", "Estonia": "et",
        "Finland": "fi", "France": "fr", "Georgia": "ka", "Germany": "de", "Greece": "el",
        "Hungary": "hu", "Iceland": "is", "Ireland": "en", "Italy": "it", "Kosovo": "sq",
        "Latvia": "lv", "Liechtenstein": "de", "Lithuania": "lt", "Luxembourg": "fr", "Malta": "mt",
        "Moldova": "ro", "Monaco": "fr", "Montenegro": "sr", "Netherlands": "nl", "North Macedonia": "mk",
        "Norway": "no", "Poland": "pl", "Portugal": "pt", "Romania": "ro", "Russia": "ru",
        "San Marino": "it", "Serbia": "sr", "Slovakia": "sk", "Slovenia": "sl", "Spain": "es",
        "Sweden": "sv", "Switzerland": "de", "Turkey": "tr", "Ukraine": "uk", "United Kingdom": "en",
        "Vatican City": "it",

        /* Latin America & Caribbean */
        "Argentina": "es", "Bahamas": "en", "Barbados": "en", "Belize": "en", "Bermuda": "en",
        "Bolivia": "es", "Brazil": "pt", "Cayman Islands": "en", "Chile": "es", "Colombia": "es",
        "Costa Rica": "es", "Dominican Republic": "es", "Ecuador": "es", "El Salvador": "es",
        "Guatemala": "es", "Honduras": "es", "Jamaica": "en", "Mexico": "es", "Nicaragua": "es",
        "Panama": "es", "Paraguay": "es", "Peru": "es", "Puerto Rico": "es", "Trinidad and Tobago": "en",
        "Uruguay": "es", "Venezuela": "es",

        /* United States & Canada */
        "Canada": "en", "United States": "en"
    };

    const nativeNameMap = {
        /* Native country names, matching countries.js */
        /* Complete mapping identical to previously provided */
        "Algeria": "الجزائر", "Angola": "Angola", "Bahrain": "البحرين", "Botswana": "Botswana",
        "Cameroon": "Cameroun", "Egypt": "مصر", "Ghana": "Ghana", "India": "भारत",
        "Iran": "ایران", "Israel": "ישראל", "Ivory Coast": "Côte d'Ivoire", "Jordan": "الأردن",
        "Kenya": "Kenya", "Kuwait": "الكويت", "Lebanon": "لبنان", "Morocco": "Maroc",
        "Mozambique": "Moçambique", "Namibia": "Namibia", "Nigeria": "Nigeria", "Oman": "عُمان",
        "Pakistan": "پاکستان", "Qatar": "قطر", "Saudi Arabia": "المملكة العربية السعودية", "Senegal": "Sénégal",
        "South Africa": "South Africa", "Tanzania": "Tanzania", "Tunisia": "تونس", "Turkey": "Türkiye",
        "Uganda": "Uganda", "United Arab Emirates": "الإمارات العربية المتحدة",

        "Australia": "Australia", "Bangladesh": "বাংলাদেশ", "Brunei": "Brunei",
        "Cambodia": "កម្ពុជា", "China Mainland": "中国大陆", "Hong Kong": "香港", "Indonesia": "Indonesia",
        "Japan": "日本", "Kazakhstan": "Қазақстан", "Macau": "澳門", "Malaysia": "Malaysia",
        "New Zealand": "New Zealand", "Philippines": "Philippines", "Singapore": "Singapore",
        "South Korea": "대한민국", "Sri Lanka": "ශ්‍රී ලංකා", "Taiwan": "台灣", "Thailand": "ไทย",
        "Vietnam": "Việt Nam",

        "Albania": "Albania", "Andorra": "Andorra", "Armenia": "Հայաստան", "Austria": "Österreich",
        "Azerbaijan": "Azərbaycan", "Belarus": "Беларусь", "Belgium": "Belgique", "Bosnia and Herzegovina": "Bosna i Hercegovina",
        "Bulgaria": "България", "Croatia": "Hrvatska", "Cyprus": "Κύπρος", "Czech Republic": "Česká republika",
        "Denmark": "Danmark", "Estonia": "Eesti", "Finland": "Suomi", "France": "France",
        "Georgia": "საქართველო", "Germany": "Deutschland", "Greece": "Ελλάδα", "Hungary": "Magyarország",
        "Iceland": "Ísland", "Ireland": "Ireland", "Italy": "Italia", "Kosovo": "Kosovo",
        "Latvia": "Latvija", "Liechtenstein": "Liechtenstein", "Lithuania": "Lietuva", "Luxembourg": "Luxembourg",
        "Malta": "Malta", "Moldova": "Moldova", "Monaco": "Monaco", "Montenegro": "Crna Gora",
        "Netherlands": "Nederland", "North Macedonia": "Maqedonia e Veriut", "Norway": "Norge",
        "Poland": "Polska", "Portugal": "Portugal", "Romania": "România", "Russia": "Россия",
        "San Marino": "San Marino", "Serbia": "Srbija", "Slovakia": "Slovensko", "Slovenia": "Slovenija",
        "Spain": "España", "Sweden": "Sverige", "Switzerland": "Schweiz", "Turkey": "Türkiye",
        "Ukraine": "Україна", "United Kingdom": "United Kingdom", "Vatican City": "Vatican City",

        "Argentina": "Argentina", "Bahamas": "Bahamas", "Barbados": "Barbados", "Belize": "Belize",
        "Bermuda": "Bermuda", "Bolivia": "Bolivia", "Brazil": "Brasil", "Cayman Islands": "Cayman Islands",
        "Chile": "Chile", "Colombia": "Colombia", "Costa Rica": "Costa Rica", "Dominican Republic": "República Dominicana",
        "Ecuador": "Ecuador", "El Salvador": "El Salvador", "Guatemala": "Guatemala", "Honduras": "Honduras",
        "Jamaica": "Jamaica", "Mexico": "México", "Nicaragua": "Nicaragua", "Panama": "Panamá",
        "Paraguay": "Paraguay", "Peru": "Perú", "Puerto Rico": "Puerto Rico", "Trinidad and Tobago": "Trinidad & Tobago",
        "Uruguay": "Uruguay", "Venezuela": "Venezuela",

        "Canada": "Canada", "United States": "United States"
    };

    // ================================
    // Translation Cache and Async Function
    // ================================
    let currentLanguage = "en";
    let currentRegion = "United States";
    const translationCache = new Map();

    const translateText = async (text, targetLang) => {
        if (targetLang === "en") return text;
        const cacheKey = `${text}_${targetLang}`;
        if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);
        try {
            const encoded = encodeURIComponent(text);
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encoded}`);
            const data = await response.json();
            const translated = data[0].map(item => item[0]).join("");
            translationCache.set(cacheKey, translated);
            return translated;
        } catch {
            return text;
        }
    };

    // ================================
    // Apply Language Function
    // ================================
    const applyLanguage = async (lang) => {
        currentLanguage = lang;
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        const nodes = document.querySelectorAll("[data-i18n-key]");
        for (const el of nodes) {
            const originalText = el.dataset.originalText || el.textContent;
            if (!el.dataset.originalText) el.dataset.originalText = originalText;
            if (["fa","ar","ur"].includes(lang)) el.setAttribute("dir", "rtl");
            else el.removeAttribute("dir");
            el.textContent = await translateText(originalText, lang);
        }
        if (!applyLanguage.menuOverlayHandlerAdded) {
            document.addEventListener("menuOverlayOpen", async () => {
                const menuNodes = document.querySelectorAll("#menu-overlay [data-i18n-key]");
                for (const el of menuNodes) {
                    const originalText = el.dataset.originalText || el.textContent;
                    if (!el.dataset.originalText) el.dataset.originalText = originalText;
                    el.textContent = await translateText(originalText, currentLanguage);
                }
            });
            applyLanguage.menuOverlayHandlerAdded = true;
        }
    };

    // ================================
    // Apply Region Function
    // ================================
    const applyRegion = (region) => {
        currentRegion = region;
        localStorage.setItem(REGION_STORAGE_KEY, region);
        document.querySelectorAll("[data-region-currency]").forEach(el => {
            if (window.CURRENCY && window.CURRENCY[region]) el.textContent = window.CURRENCY[region];
        });
    };

    // ================================
    // Country Overlay Interactions
    // ================================
    const initCountryOverlay = () => {
        const overlay = document.getElementById("country-overlay");
        const selector = document.getElementById("country-selector");
        const closeBtn = document.getElementById("country-overlay-close");
        const options = document.querySelectorAll(".country-option");

        if (closeBtn) closeBtn.addEventListener("click", () => {
            overlay.classList.remove("visible");
            setTimeout(() => { overlay.classList.add("hidden"); document.dispatchEvent(new CustomEvent("countryOverlayClose")); }, 400);
        });

        if (selector && overlay) selector.addEventListener("click", () => {
            overlay.classList.remove("hidden");
            document.dispatchEvent(new CustomEvent("countryOverlayOpen"));
            setTimeout(() => overlay.classList.add("visible"), 20);
        });

        options.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const country = e.currentTarget.dataset.country;
                if (country) {
                    const regionLang = REGION_LANGUAGE_MAP[country] || "en";
                    applyRegion(country);
                    await applyLanguage(regionLang);
                    const nativeName = nativeNameMap[country] || country;
                    const currentCountryEl = document.getElementById("current-country");
                    if (currentCountryEl) currentCountryEl.textContent = nativeName;
                    overlay.classList.remove("visible");
                    setTimeout(() => { overlay.classList.add("hidden"); document.dispatchEvent(new CustomEvent("countryOverlayClose")); }, 400);
                }
            });
        });
    };

    // ================================
    // Language Toggle Override
    // ================================
    const initLanguageToggle = () => {
        const toggle = document.getElementById("language-toggle");
        if (!toggle) return;
        const updateToggle = () => toggle.classList.toggle("active", localStorage.getItem(EN_OVERRIDE_KEY) === "true");
        toggle.addEventListener("click", () => {
            const isActive = localStorage.getItem(EN_OVERRIDE_KEY) === "true";
            if (isActive) { localStorage.removeItem(EN_OVERRIDE_KEY); applyLanguage(REGION_LANGUAGE_MAP[currentRegion] || "en"); }
            else { localStorage.setItem(EN_OVERRIDE_KEY, "true"); applyLanguage("en"); }
            updateToggle();
        });
        if (localStorage.getItem(EN_OVERRIDE_KEY) === "true") applyLanguage("en");
        updateToggle();
    };

    // ================================
    // Initialization Function
    // ================================
    const init = async () => {
        const storedRegion = localStorage.getItem(REGION_STORAGE_KEY);
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const enOverrideActive = localStorage.getItem(EN_OVERRIDE_KEY) === "true";

        if (storedRegion) {
            currentRegion = storedRegion;
            currentLanguage = storedLanguage || (REGION_LANGUAGE_MAP[currentRegion] || "en");
        } else {
            localStorage.setItem(REGION_STORAGE_KEY, currentRegion);
            localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
        }

        if (enOverrideActive) await applyLanguage("en");
        else await applyLanguage(currentLanguage);

        applyRegion(currentRegion);
        initCountryOverlay();
        initLanguageToggle();
    };

    return { init, applyLanguage, applyRegion };
})();

// ================================
// DOMContentLoaded Event Handler
// ================================
document.addEventListener("DOMContentLoaded", () => {
    if (window.ARTAN_TRANSLATION && typeof window.ARTAN_TRANSLATION.init === "function") {
        window.ARTAN_TRANSLATION.init();
    }
    document.addEventListener("announcementFinished", () => {
        const announcement = document.getElementById("announcement");
        const enter = document.getElementById("enter-button");
        if (announcement) announcement.classList.add("hidden");
        if (enter) enter.classList.add("visible");
    });
});