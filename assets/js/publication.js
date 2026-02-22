(() => {
  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function safePath(p) {
    if (!p) return null;
    if (p.includes("..") || p.startsWith("/") || p.startsWith("\\")) return null;
    return p.replace(/^\/+/, "");
  }

  async function load() {
    const rawParam = getParam("p");
    const rel = rawParam ? safePath(decodeURIComponent(rawParam)) : null;
    // Detect active language (default: en)
    const activeLang = (window.ARTAN_LOCALE && window.ARTAN_LOCALE.language)
      ? window.ARTAN_LOCALE.language
      : (localStorage.getItem('artan_language') || 'en');
    const titleEl = document.getElementById("post-title");
    const contentEl = document.getElementById("post-content");

    if (!rel) {
      titleEl.textContent = "Missing publication path";
      titleEl.setAttribute("data-i18n-key", "publication.missingPath");
      contentEl.innerHTML =
        "<p>Provide <code>?p=Essays/your-file.md</code> (or Notes/Research/Visual).</p>";
      return;
    }

    // Try locale-specific file first, then fallback to English
    const localizedUrl = `content_sync/${activeLang}/${rel}`;
    const fallbackUrl = `content_sync/en/${rel}`;

    try {
      let md = null;
      let res = await fetch(localizedUrl, { cache: "no-cache" });
      
      if (!res.ok && activeLang !== 'en') {
        res = await fetch(fallbackUrl, { cache: "no-cache" });
      }
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      md = await res.text();

      const firstH1 = md.match(/^#\s+(.+)$/m);

      if (firstH1) {
        titleEl.textContent = firstH1[1].trim();
      } else {
        const filename = rel.split("/").pop().replace(/\.md$/i, "");
        const human = filename.replace(/[_-]+/g, " ");
        titleEl.textContent = human;
      }

      if (window.marked) {
        contentEl.innerHTML = window.marked.parse(md);
      } else {
        contentEl.textContent = md;
      }
    } catch (err) {
      titleEl.textContent = "Failed to load publication";
      titleEl.setAttribute("data-i18n-key", "publication.failedLoad");
      contentEl.innerHTML = `<p>Could not load publication.</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", load);
})();