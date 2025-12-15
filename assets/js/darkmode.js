document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById("theme-toggle-btn");
    const body = document.body;

    // Initialize theme based on saved preference or system
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        body.classList.toggle("dark-mode", savedTheme === "dark");
    } else {
        // Optionally set system preference
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        body.classList.toggle("dark-mode", prefersDark);
    }

    // Toggle theme on button click
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function() {
            const isDark = body.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }

    // Optional: toggle based on system theme changes
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e) {
            const themeFromStorage = localStorage.getItem("theme");
            if (!themeFromStorage) {
                body.classList.toggle("dark-mode", e.matches);
            }
        });
    }
});