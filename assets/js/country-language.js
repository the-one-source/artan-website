/* =================== Country & Language Management =================== */
/* File: Country & Language Management for dynamic IP detection and language selection */

// =================== Storage keys ===================
const COUNTRY_STORAGE_KEY = "artan_country";
const REGION_STORAGE_KEY = "artan_region";
const LANGUAGE_STORAGE_KEY = "artan_language";
const EN_OVERRIDE_KEY = "artan_en_override";
const SESSION_KEY = "artan_session_active";

// =================== Country native label mapping ===================
const nativeNameMap = {
    Germany: "Deutschland", France: "France", "United Kingdom": "United Kingdom", Ireland: "Ireland",
    Denmark: "Danmark", Sweden: "Sverige", Norway: "Norge", Finland: "Suomi", Iceland: "Ísland",
    Netherlands: "Nederland", Belgium: "Belgique", Luxembourg: "Luxembourg", Switzerland: "Schweiz",
    Austria: "Österreich", Italy: "Italia", Spain: "España", Portugal: "Portugal", Greece: "Ελλάδα",
    Poland: "Polska", Hungary: "Magyarország", Romania: "România", Bulgaria: "България", Croatia: "Hrvatska",
    Serbia: "Srbija", Slovenia: "Slovenija", Slovakia: "Slovensko", CzechRepublic: "Česká republika",
    Estonia: "Eesti", Latvia: "Latvija", Lithuania: "Lietuva", Ukraine: "Україна", Russia: "Россия",
    Belarus: "Беларусь", Moldova: "Moldova", Georgia: "საქართველო", Armenia: "Հայաստան", Azerbaijan: "Azərbaycan",
    Turkey: "Türkiye", China: "中国", "China Mainland": "中国大陆", Taiwan: "台灣", HongKong: "香港",
    Macau: "澳門", Japan: "日本", "South Korea": "대한민국", Thailand: "ไทย", Vietnam: "Việt Nam",
    Australia: "Australia", "New Zealand": "New Zealand", Iran: "ایران", Pakistan: "پاکستان",
    India: "India", Egypt: "مصر", Morocco: "Maroc", Tunisia: "تونس", "United Arab Emirates": "الإمارات العربية المتحدة"
};

// =================== Region to language mapping ===================
const REGION_LANGUAGE_MAP = {
    Germany: "de", France: "fr", "United Kingdom": "en", Ireland: "en",
    Denmark: "da", Sweden: "sv", Norway: "no", Finland: "fi", Iceland: "is",
    Netherlands: "nl", Belgium: "fr", Luxembourg: "fr", Switzerland: "de", Austria: "de",
    Italy: "it", Spain: "es", Portugal: "pt", Greece: "el", Poland: "pl", Hungary: "hu",
    Romania: "ro", Bulgaria: "bg", Croatia: "hr", Serbia: "sr", Slovenia: "sl", Slovakia: "sk",
    CzechRepublic: "cs", Estonia: "et", Latvia: "lv", Lithuania: "lt", Ukraine: "uk",
    Russia: "ru", Belarus: "ru", Moldova: "ro", Georgia: "ka", Armenia: "hy", Azerbaijan: "az",
    Turkey: "tr", China: "zh", "China Mainland": "zh", Taiwan: "zh", HongKong: "zh", Macau: "zh",
    Japan: "ja", "South Korea": "ko", Thailand: "th", Vietnam: "vi", Australia: "en",
    "New Zealand": "en", Iran: "fa", Pakistan: "ur", India: "hi", Egypt: "ar", Morocco: "ar",
    Tunisia: "ar", "United Arab Emirates": "ar"
};

document.addEventListener('DOMContentLoaded', () => {
    const countryLabelEl = document.getElementById("current-country");
    const languageToggleEl = document.getElementById("language-toggle");

    function updateLanguageToggleText(languageCode) {
        if (!languageToggleEl) return;
        languageToggleEl.textContent = languageCode.toUpperCase();
    }

    function applyLanguage(langCode) {
        if (window.ARTAN_TRANSLATION?.applyLanguage) {
            window.ARTAN_TRANSLATION.applyLanguage(langCode);
        }
        updateLanguageToggleText(langCode);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    }

    function setCountryRegion(countryName, overrideLang) {
        if (!countryName || !countryLabelEl) return;

        const nativeName = nativeNameMap[countryName] || countryName;
        countryLabelEl.textContent = nativeName;

        localStorage.setItem(COUNTRY_STORAGE_KEY, countryName);
        localStorage.setItem(REGION_STORAGE_KEY, countryName);

        const enOverrideActive = localStorage.getItem(EN_OVERRIDE_KEY) === "true";
        let lang = overrideLang || (enOverrideActive ? "en" : (REGION_LANGUAGE_MAP[countryName] || "en"));
        applyLanguage(lang);
    }

    function initializeLanguageToggle() {
        if (!languageToggleEl) return;
        const enOverrideActive = localStorage.getItem(EN_OVERRIDE_KEY) === "true";
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const currentLang = enOverrideActive ? "en" : (storedLanguage || "en");
        updateLanguageToggleText(currentLang);
    }

    if (languageToggleEl) {
        languageToggleEl.addEventListener("click", () => {
            const enActive = localStorage.getItem(EN_OVERRIDE_KEY) === "true";
            if (enActive) {
                localStorage.removeItem(EN_OVERRIDE_KEY);
                const currentRegion = localStorage.getItem(REGION_STORAGE_KEY) || "United States";
                const lang = REGION_LANGUAGE_MAP[currentRegion] || "en";
                applyLanguage(lang);
            } else {
                localStorage.setItem(EN_OVERRIDE_KEY, "true");
                applyLanguage("en");
            }
        });
    }

    (function initCountryLanguage() {
        const isFirstSession = !sessionStorage.getItem(SESSION_KEY);
        const storedCountry = localStorage.getItem(COUNTRY_STORAGE_KEY);
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const enOverrideActive = localStorage.getItem(EN_OVERRIDE_KEY) === "true";

        if (!isFirstSession) {
            if (storedCountry && countryLabelEl) {
                countryLabelEl.textContent = nativeNameMap[storedCountry] || storedCountry;
            }
            if (enOverrideActive) {
                applyLanguage("en");
            } else if (storedLanguage) {
                applyLanguage(storedLanguage);
            } else if (storedCountry) {
                applyLanguage(REGION_LANGUAGE_MAP[storedCountry] || "en");
            }
            initializeLanguageToggle();
        } else {
            sessionStorage.setItem(SESSION_KEY, "true");
            fetch("https://ipapi.co/json/")
                .then(res => res.json())
                .then(data => {
                    const countryName = data?.country_name || "United States";
                    setCountryRegion(countryName);
                    initializeLanguageToggle();
                })
                .catch(() => {
                    setCountryRegion("United States");
                    initializeLanguageToggle();
                });
        }
    })();
});