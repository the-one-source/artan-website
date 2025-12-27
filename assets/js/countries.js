/* =================== Country & Region Registry =================== */
/* Source of truth for the Country / Region overlay.
   Apple-inspired grouping, single-source, no duplicates. */

(function () {
  const COUNTRIES_DATA = [
    {
      region: "Africa, Middle East & India",
      i18nKey: "region.africaMiddleEastIndia",
      countries: [
        { name: "Algeria", label: "Algeria" },
        { name: "Angola", label: "Angola" },
        { name: "Bahrain", label: "Bahrain" },
        { name: "Botswana", label: "Botswana" },
        { name: "Cameroon", label: "Cameroon" },
        { name: "Egypt", label: "مصر" },
        { name: "Ghana", label: "Ghana" },
        { name: "India", label: "India" },
        { name: "Iran", label: "ایران" },
        { name: "Israel", label: "Israel" },
        { name: "Ivory Coast", label: "Ivory Coast" },
        { name: "Jordan", label: "Jordan" },
        { name: "Kenya", label: "Kenya" },
        { name: "Kuwait", label: "Kuwait" },
        { name: "Lebanon", label: "Lebanon" },
        { name: "Morocco", label: "Maroc" },
        { name: "Mozambique", label: "Mozambique" },
        { name: "Namibia", label: "Namibia" },
        { name: "Nigeria", label: "Nigeria" },
        { name: "Oman", label: "Oman" },
        { name: "Pakistan", label: "پاکستان" },
        { name: "Qatar", label: "Qatar" },
        { name: "Saudi Arabia", label: "المملكة العربية السعودية" },
        { name: "Senegal", label: "Senegal" },
        { name: "South Africa", label: "South Africa" },
        { name: "Tanzania", label: "Tanzania" },
        { name: "Tunisia", label: "Tunisia" },
        { name: "Turkey", label: "Türkiye" },
        { name: "Uganda", label: "Uganda" },
        { name: "United Arab Emirates", label: "الإمارات العربية المتحدة" }
      ]
    },
    {
      region: "Asia Pacific",
      i18nKey: "region.asiaPacific",
      countries: [
        { name: "Australia", label: "Australia" },
        { name: "Bangladesh", label: "Bangladesh" },
        { name: "Brunei", label: "Brunei" },
        { name: "Cambodia", label: "Cambodia" },
        { name: "China Mainland", label: "中国大陆" },
        { name: "Hong Kong", label: "香港" },
        { name: "Indonesia", label: "Indonesia" },
        { name: "Japan", label: "日本" },
        { name: "Kazakhstan", label: "Kazakhstan" },
        { name: "Macau", label: "澳門" },
        { name: "Malaysia", label: "Malaysia" },
        { name: "New Zealand", label: "New Zealand" },
        { name: "Philippines", label: "Philippines" },
        { name: "Singapore", label: "Singapore" },
        { name: "South Korea", label: "대한민국" },
        { name: "Sri Lanka", label: "Sri Lanka" },
        { name: "Taiwan", label: "台灣" },
        { name: "Thailand", label: "ไทย" },
        { name: "Vietnam", label: "Việt Nam" }
      ]
    },
    {
      region: "Europe",
      i18nKey: "region.europe",
      countries: [
        { name: "Albania", label: "Albania" },
        { name: "Andorra", label: "Andorra" },
        { name: "Armenia", label: "Armenia" },
        { name: "Austria", label: "Austria" },
        { name: "Azerbaijan", label: "Azerbaijan" },
        { name: "Belarus", label: "Belarus" },
        { name: "Belgium", label: "Belgium" },
        { name: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
        { name: "Bulgaria", label: "Bulgaria" },
        { name: "Croatia", label: "Croatia" },
        { name: "Cyprus", label: "Cyprus" },
        { name: "Czech Republic", label: "Czech Republic" },
        { name: "Denmark", label: "Denmark" },
        { name: "Estonia", label: "Estonia" },
        { name: "Finland", label: "Finland" },
        { name: "France", label: "France" },
        { name: "Georgia", label: "Georgia" },
        { name: "Germany", label: "Deutschland" },
        { name: "Greece", label: "Greece" },
        { name: "Hungary", label: "Hungary" },
        { name: "Iceland", label: "Iceland" },
        { name: "Ireland", label: "Ireland" },
        { name: "Italy", label: "Italia" },
        { name: "Kosovo", label: "Kosovo" },
        { name: "Latvia", label: "Latvia" },
        { name: "Liechtenstein", label: "Liechtenstein" },
        { name: "Lithuania", label: "Lithuania" },
        { name: "Luxembourg", label: "Luxembourg" },
        { name: "Malta", label: "Malta" },
        { name: "Moldova", label: "Moldova" },
        { name: "Monaco", label: "Monaco" },
        { name: "Montenegro", label: "Montenegro" },
        { name: "Netherlands", label: "Nederland" },
        { name: "North Macedonia", label: "North Macedonia" },
        { name: "Norway", label: "Norge" },
        { name: "Poland", label: "Poland" },
        { name: "Portugal", label: "Portugal" },
        { name: "Romania", label: "Romania" },
        { name: "Russia", label: "Russia" },
        { name: "San Marino", label: "San Marino" },
        { name: "Serbia", label: "Serbia" },
        { name: "Slovakia", label: "Slovakia" },
        { name: "Slovenia", label: "Slovenia" },
        { name: "Spain", label: "España" },
        { name: "Sweden", label: "Sverige" },
        { name: "Switzerland", label: "Schweiz" },
        { name: "Turkey", label: "Türkiye" },
        { name: "Ukraine", label: "Ukraine" },
        { name: "United Kingdom", label: "United Kingdom" },
        { name: "Vatican City", label: "Vatican City" }
      ]
    },
    {
      region: "Latin America & Caribbean",
      i18nKey: "region.latinAmericaCaribbean",
      countries: [
        { name: "Argentina", label: "Argentina" },
        { name: "Bahamas", label: "Bahamas" },
        { name: "Barbados", label: "Barbados" },
        { name: "Belize", label: "Belize" },
        { name: "Bermuda", label: "Bermuda" },
        { name: "Bolivia", label: "Bolivia" },
        { name: "Brazil", label: "Brasil" },
        { name: "Cayman Islands", label: "Cayman Islands" },
        { name: "Chile", label: "Chile" },
        { name: "Colombia", label: "Colombia" },
        { name: "Costa Rica", label: "Costa Rica" },
        { name: "Dominican Republic", label: "Dominican Republic" },
        { name: "Ecuador", label: "Ecuador" },
        { name: "El Salvador", label: "El Salvador" },
        { name: "Guatemala", label: "Guatemala" },
        { name: "Honduras", label: "Honduras" },
        { name: "Jamaica", label: "Jamaica" },
        { name: "Mexico", label: "México" },
        { name: "Nicaragua", label: "Nicaragua" },
        { name: "Panama", label: "Panama" },
        { name: "Paraguay", label: "Paraguay" },
        { name: "Peru", label: "Perú" },
        { name: "Puerto Rico", label: "Puerto Rico" },
        { name: "Trinidad and Tobago", label: "Trinidad and Tobago" },
        { name: "Uruguay", label: "Uruguay" },
        { name: "Venezuela", label: "Venezuela" }
      ]
    },
    {
      region: "United States & Canada",
      i18nKey: "region.unitedStatesCanada",
      countries: [
        { name: "Canada", label: "Canada" },
        { name: "United States", label: "United States" }
      ]
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('country-regions');
    if (!container) return;

    COUNTRIES_DATA.forEach(region => {
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
        btn.textContent = country.label;
        li.appendChild(btn);
        list.appendChild(li);
      });

      regionEl.appendChild(title);
      regionEl.appendChild(list);

      const hr = document.createElement('hr');
      hr.className = 'footer-separator';
      regionEl.appendChild(hr);

      container.appendChild(regionEl);
    });
  });
})();
