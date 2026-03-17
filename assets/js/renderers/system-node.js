

/* =============================================================================
   SYSTEM NODE — FRAGMENT LOADER (SOVEREIGN)
   - Does NOT touch main.js
   - Mounts /assets/fragments/system-node.html into #system-node-mount
   - Safe with fragment-based site (waits for mount)
============================================================================= */

(() => {
  const MOUNT_ID = 'system-node-mount';
  const FRAGMENT_URL = 'assets/fragments/system-node.html';

  const mount = async () => {
    const host = document.getElementById(MOUNT_ID);
    if (!host) return false;
    if (host.dataset.mounted === '1') return true;

    try {
      const res = await fetch(FRAGMENT_URL, { cache: 'no-store' });
      if (!res.ok) return false;
      const html = await res.text();
      host.innerHTML = html;
      host.dataset.mounted = '1';
      return true;
    } catch {
      return false;
    }
  };

  const boot = () => {
    // Try immediately
    mount().then((ok) => {
      if (ok) return;

      // If mount not yet present, observe DOM
      const mo = new MutationObserver(() => {
        mount().then((done) => {
          if (done) mo.disconnect();
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();