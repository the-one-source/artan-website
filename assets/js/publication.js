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
    const rel = safePath(getParam("p"));
    const titleEl = document.getElementById("post-title");
    const contentEl = document.getElementById("post-content");

    if (!rel) {
      titleEl.textContent = "Missing publication path";
      contentEl.innerHTML =
        "<p>Provide <code>?p=Essays/your-file.md</code> (or Notes/Research/Visual).</p>";
      return;
    }

    const url = `content_sync/${rel}`;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const md = await res.text();

      const firstH1 = md.match(/^#\s+(.+)$/m);
      titleEl.textContent = firstH1 ? firstH1[1].trim() : rel.split("/").pop();

      if (window.marked) {
        contentEl.innerHTML = window.marked.parse(md);
      } else {
        contentEl.textContent = md;
      }
    } catch (err) {
      titleEl.textContent = "Failed to load publication";
      contentEl.innerHTML = `<p>Could not load <code>${url}</code>.</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", load);
})();