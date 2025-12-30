/* =================== Country & Region Registry =================== */
/* Source of truth for the Country / Region overlay.
   Apple-inspired grouping, single-source, no duplicates. */

(function () {
  const COUNTRIES_DATA = [
    {
      region: "Africa, Middle East & India",
      i18nKey: "region.africaMiddleEastIndia",
      countries: [
        { name: "Algeria", label: "Algeria", languageCode: "ar" },
        { name: "Angola", label: "Angola", languageCode: "en" },
        { name: "Bahrain", label: "Bahrain", languageCode: "ar" },
        { name: "Botswana", label: "Botswana", languageCode: "en" },
        { name: "Cameroon", label: "Cameroon", languageCode: "en" },
        { name: "Egypt", label: "مصر", languageCode: "ar" },
        { name: "Ghana", label: "Ghana", languageCode: "en" },
        { name: "India", label: "India", languageCode: "hi" },
        { name: "Iran", label: "ایران", languageCode: "fa" },
        { name: "Israel", label: "Israel", languageCode: "en" },
        { name: "Ivory Coast", label: "Ivory Coast", languageCode: "en" },
        { name: "Jordan", label: "Jordan", languageCode: "ar" },
        { name: "Kenya", label: "Kenya", languageCode: "en" },
        { name: "Kuwait", label: "Kuwait", languageCode: "ar" },
        { name: "Lebanon", label: "Lebanon", languageCode: "ar" },
        { name: "Morocco", label: "Maroc", languageCode: "ar" },
        { name: "Mozambique", label: "Mozambique", languageCode: "en" },
        { name: "Namibia", label: "Namibia", languageCode: "en" },
        { name: "Nigeria", label: "Nigeria", languageCode: "en" },
        { name: "Oman", label: "Oman", languageCode: "ar" },
        { name: "Pakistan", label: "پاکستان", languageCode: "ur" },
        { name: "Qatar", label: "Qatar", languageCode: "ar" },
        { name: "Saudi Arabia", label: "المملكة العربية السعودية", languageCode: "ar" },
        { name: "Senegal", label: "Senegal", languageCode: "en" },
        { name: "South Africa", label: "South Africa", languageCode: "en" },
        { name: "Tanzania", label: "Tanzania", languageCode: "en" },
        { name: "Tunisia", label: "Tunisia", languageCode: "ar" },
        { name: "Turkey", label: "Türkiye", languageCode: "tr" },
        { name: "Uganda", label: "Uganda", languageCode: "en" },
        { name: "United Arab Emirates", label: "الإمارات العربية المتحدة", languageCode: "ar" }
      ]
    },
    {
      region: "Asia Pacific",
      i18nKey: "region.asiaPacific",
      countries: [
        { name: "Australia", label: "Australia", languageCode: "en" },
        { name: "Bangladesh", label: "Bangladesh", languageCode: "en" },
        { name: "Brunei", label: "Brunei", languageCode: "en" },
        { name: "Cambodia", label: "Cambodia", languageCode: "en" },
        { name: "China Mainland", label: "中国大陆", languageCode: "zh" },
        { name: "Hong Kong", label: "香港", languageCode: "en" },
        { name: "Indonesia", label: "Indonesia", languageCode: "en" },
        { name: "Japan", label: "日本", languageCode: "ja" },
        { name: "Kazakhstan", label: "Kazakhstan", languageCode: "en" },
        { name: "Macau", label: "澳門", languageCode: "en" },
        { name: "Malaysia", label: "Malaysia", languageCode: "en" },
        { name: "New Zealand", label: "New Zealand", languageCode: "en" },
        { name: "Philippines", label: "Philippines", languageCode: "en" },
        { name: "Singapore", label: "Singapore", languageCode: "en" },
        { name: "South Korea", label: "대한민국", languageCode: "ko" },
        { name: "Sri Lanka", label: "Sri Lanka", languageCode: "en" },
        { name: "Taiwan", label: "台灣", languageCode: "en" },
        { name: "Thailand", label: "ไทย", languageCode: "en" },
        { name: "Vietnam", label: "Việt Nam", languageCode: "en" }
      ]
    },
    {
      region: "Europe",
      i18nKey: "region.europe",
      countries: [
        { name: "Albania", label: "Albania", languageCode: "en" },
        { name: "Andorra", label: "Andorra", languageCode: "en" },
        { name: "Armenia", label: "Armenia", languageCode: "en" },
        { name: "Austria", label: "Austria", languageCode: "en" },
        { name: "Azerbaijan", label: "Azerbaijan", languageCode: "en" },
        { name: "Belarus", label: "Belarus", languageCode: "en" },
        { name: "Belgium", label: "Belgium", languageCode: "en" },
        { name: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina", languageCode: "en" },
        { name: "Bulgaria", label: "Bulgaria", languageCode: "en" },
        { name: "Croatia", label: "Croatia", languageCode: "en" },
        { name: "Cyprus", label: "Cyprus", languageCode: "en" },
        { name: "Czech Republic", label: "Czech Republic", languageCode: "en" },
        { name: "Denmark", label: "Denmark", languageCode: "en" },
        { name: "Estonia", label: "Estonia", languageCode: "en" },
        { name: "Finland", label: "Finland", languageCode: "fi" },
        { name: "France", label: "France", languageCode: "fr" },
        { name: "Georgia", label: "Georgia", languageCode: "en" },
        { name: "Germany", label: "Deutschland", languageCode: "de" },
        { name: "Greece", label: "Greece", languageCode: "en" },
        { name: "Hungary", label: "Hungary", languageCode: "en" },
        { name: "Iceland", label: "Iceland", languageCode: "en" },
        { name: "Ireland", label: "Ireland", languageCode: "en" },
        { name: "Italy", label: "Italia", languageCode: "it" },
        { name: "Kosovo", label: "Kosovo", languageCode: "en" },
        { name: "Latvia", label: "Latvia", languageCode: "en" },
        { name: "Liechtenstein", label: "Liechtenstein", languageCode: "en" },
        { name: "Lithuania", label: "Lithuania", languageCode: "en" },
        { name: "Luxembourg", label: "Luxembourg", languageCode: "en" },
        { name: "Malta", label: "Malta", languageCode: "en" },
        { name: "Moldova", label: "Moldova", languageCode: "en" },
        { name: "Monaco", label: "Monaco", languageCode: "en" },
        { name: "Montenegro", label: "Montenegro", languageCode: "en" },
        { name: "Netherlands", label: "Nederland", languageCode: "nl" },
        { name: "North Macedonia", label: "North Macedonia", languageCode: "en" },
        { name: "Norway", label: "Norge", languageCode: "no" },
        { name: "Poland", label: "Poland", languageCode: "pl" },
        { name: "Portugal", label: "Portugal", languageCode: "pt" },
        { name: "Romania", label: "Romania", languageCode: "en" },
        { name: "Russia", label: "Russia", languageCode: "ru" },
        { name: "San Marino", label: "San Marino", languageCode: "en" },
        { name: "Serbia", label: "Serbia", languageCode: "en" },
        { name: "Slovakia", label: "Slovakia", languageCode: "en" },
        { name: "Slovenia", label: "Slovenia", languageCode: "en" },
        { name: "Spain", label: "España", languageCode: "es" },
        { name: "Sweden", label: "Sverige", languageCode: "sv" },
        { name: "Switzerland", label: "Schweiz", languageCode: "en" },
        { name: "Turkey", label: "Türkiye", languageCode: "tr" },
        { name: "Ukraine", label: "Ukraine", languageCode: "uk" },
        { name: "United Kingdom", label: "United Kingdom", languageCode: "en" },
        { name: "Vatican City", label: "Vatican City", languageCode: "en" }
      ]
    },
    {
      region: "Latin America & Caribbean",
      i18nKey: "region.latinAmericaCaribbean",
      countries: [
        { name: "Argentina", label: "Argentina", languageCode: "en" },
        { name: "Bahamas", label: "Bahamas", languageCode: "en" },
        { name: "Barbados", label: "Barbados", languageCode: "en" },
        { name: "Belize", label: "Belize", languageCode: "en" },
        { name: "Bermuda", label: "Bermuda", languageCode: "en" },
        { name: "Bolivia", label: "Bolivia", languageCode: "en" },
        { name: "Brazil", label: "Brasil", languageCode: "pt" },
        { name: "Cayman Islands", label: "Cayman Islands", languageCode: "en" },
        { name: "Chile", label: "Chile", languageCode: "en" },
        { name: "Colombia", label: "Colombia", languageCode: "en" },
        { name: "Costa Rica", label: "Costa Rica", languageCode: "en" },
        { name: "Dominican Republic", label: "Dominican Republic", languageCode: "en" },
        { name: "Ecuador", label: "Ecuador", languageCode: "en" },
        { name: "El Salvador", label: "El Salvador", languageCode: "en" },
        { name: "Guatemala", label: "Guatemala", languageCode: "en" },
        { name: "Honduras", label: "Honduras", languageCode: "en" },
        { name: "Jamaica", label: "Jamaica", languageCode: "en" },
        { name: "Mexico", label: "México", languageCode: "en" },
        { name: "Nicaragua", label: "Nicaragua", languageCode: "en" },
        { name: "Panama", label: "Panama", languageCode: "en" },
        { name: "Paraguay", label: "Paraguay", languageCode: "en" },
        { name: "Peru", label: "Perú", languageCode: "en" },
        { name: "Puerto Rico", label: "Puerto Rico", languageCode: "en" },
        { name: "Trinidad and Tobago", label: "Trinidad and Tobago", languageCode: "en" },
        { name: "Uruguay", label: "Uruguay", languageCode: "en" },
        { name: "Venezuela", label: "Venezuela", languageCode: "en" }
      ]
    },
    {
      region: "United States & Canada",
      i18nKey: "region.unitedStatesCanada",
      countries: [
        { name: "Canada", label: "Canada", languageCode: "en" },
        { name: "United States", label: "United States", languageCode: "en" }
      ]
    }
  ];

  // Expose for other modules (read-only)
  window.ARTAN_COUNTRIES_DATA = COUNTRIES_DATA;

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('country-regions');
    if (!container) return;

    COUNTRIES_DATA.forEach((region, index) => {
      const regionEl = document.createElement('div');
      regionEl.className = 'country-region';
      regionEl.dataset.region = region.region;

      const title = document.createElement('h3');
      title.className = 'region-title';
      title.dataset.i18nKey = region.i18nKey;
      title.textContent = region.region;

      const list = document.createElement('ul');
      list.className = 'country-list';

      region.countries.forEach(country => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'country-option';
        btn.dataset.country = country.name;
        btn.dataset.language = country.languageCode;
        btn.textContent = country.label;
        li.appendChild(btn);
        list.appendChild(li);
      });

      regionEl.appendChild(title);
      regionEl.appendChild(list);

      if (index < COUNTRIES_DATA.length - 1) {
        const hr = document.createElement('hr');
        hr.className = 'footer-separator';
        regionEl.appendChild(hr);
      }

      container.appendChild(regionEl);
    });

    // Single delegated handler for country selection
    container.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.country-option') : null;
      if (!btn) return;

      const name = btn.dataset.country || btn.textContent || '';
      const label = btn.textContent || name;
      const languageCode = btn.dataset.language || 'en';

      document.dispatchEvent(
        new CustomEvent('country-selected', { detail: { name, label, languageCode } })
      );
    });
  });
})();