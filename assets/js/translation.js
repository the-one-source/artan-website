/**
 * Translation and Region Management - Dedicated Module
 * Fully IP-detecting, future-proof, online/offline fallback
 */

window.ARTAN_TRANSLATION = (function () {
    // Real-time translation function (free, browser-based fallback)
    const translateText = async (text, targetLang) => {
        if (targetLang === "en") return text; // EN override, return original
        try {
            const encoded = encodeURIComponent(text);
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encoded}`);
            const data = await response.json();
            return data[0].map(item => item[0]).join("");
        } catch (e) {
            return text; // fallback to English if translation fails
        }
    };

    const LANGUAGE_STORAGE_KEY = "artan_language";
    const REGION_STORAGE_KEY = "artan_region";
    const REGION_LANGUAGE_MAP = {
        Germany: "de",
        France: "fr",
        "United Kingdom": "en",
        Denmark: "da",
        Switzerland: "de",
        India: "hi",
        Japan: "ja",
        China: "zh",
        Singapore: "en",
        Persia: "fa",
        Brazil: "pt",
        Mexico: "es",
        Argentina: "es",
        "United States": "en",
        Canada: "en"
    };

    let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
    let currentRegion = localStorage.getItem(REGION_STORAGE_KEY) || "Germany";

    // IP detection with online fallback, offline defaults
    const detectIP = async () => {
        // Detect if running locally
        if (window.location.protocol === "file:") {
            currentRegion = localStorage.getItem(REGION_STORAGE_KEY) || "Germany";
            currentLanguage = REGION_LANGUAGE_MAP[currentRegion] || "de";
        } else {
            try {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                if (data && data.country_name && REGION_LANGUAGE_MAP[data.country_name]) {
                    currentRegion = data.country_name;
                    currentLanguage = REGION_LANGUAGE_MAP[currentRegion];
                }
            } catch (e) {
                currentRegion = "Germany";
                currentLanguage = "de";
            }
        }
        localStorage.setItem(REGION_STORAGE_KEY, currentRegion);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    };

    const applyLanguage = (lang) => {
        console.log("Applying language:", lang);
        currentLanguage = lang;
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

        document.querySelectorAll("[data-i18n-key]").forEach(async (el) => {
            const originalText = el.textContent;
            const translated = await translateText(originalText, lang);
            el.textContent = translated;
        });
    };

    const applyRegion = (region) => {
        currentRegion = region;
        localStorage.setItem(REGION_STORAGE_KEY, region);
        document.querySelectorAll("[data-region-currency]").forEach((el) => {
            if (window.CURRENCY && window.CURRENCY[region]) {
                el.textContent = window.CURRENCY[region];
            }
        });
    };

    const initCountryOverlay = () => {
        const countryOverlay = document.getElementById("country-overlay");
        const countrySelectorButton = document.getElementById("country-selector");
        const countryOverlayClose = document.getElementById("country-overlay-close");
        const countryOptions = document.querySelectorAll(".country-option");

        if (countryOverlayClose) {
            countryOverlayClose.addEventListener("click", () => {
                countryOverlay.classList.remove("visible");
                setTimeout(() => countryOverlay.classList.add("hidden"), 400);
            });
        }

        if (countrySelectorButton && countryOverlay) {
            countrySelectorButton.addEventListener("click", () => {
                countryOverlay.classList.remove("hidden");
                setTimeout(() => countryOverlay.classList.add("visible"), 20);
            });
        }

        countryOptions.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const selectedCountry = e.currentTarget.dataset.country;
                if (selectedCountry) {
                    const regionLang = REGION_LANGUAGE_MAP[selectedCountry] || "en";
                    applyRegion(selectedCountry);
                    applyLanguage(regionLang);
                    document.getElementById("current-country").textContent = selectedCountry;
                    countryOverlay.classList.remove("visible");
                    setTimeout(() => countryOverlay.classList.add("hidden"), 400);
                }
            });
        });
    };

    const initLanguageToggle = () => {
        const languageToggle = document.getElementById("language-toggle");
        if (!languageToggle) return;

        const updateLanguageState = () => {
            const isActive = localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en";
            languageToggle.classList.toggle("active", isActive);
        };

        languageToggle.addEventListener("click", () => {
            const isActive = localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en";
            if (isActive) {
                const regionLang = REGION_LANGUAGE_MAP[currentRegion] || "en";
                localStorage.setItem(LANGUAGE_STORAGE_KEY, regionLang);
                applyLanguage(regionLang);
            } else {
                localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
                applyLanguage("en");
            }
            updateLanguageState();
        });

        updateLanguageState();
    };

    const init = async () => {
        await detectIP();
        applyLanguage(currentLanguage);
        applyRegion(currentRegion);
        initCountryOverlay();
        initLanguageToggle();
    };

    return { init, applyLanguage, applyRegion };
})();
