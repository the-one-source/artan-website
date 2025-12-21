document.addEventListener("DOMContentLoaded", () => {
    const logo = document.querySelector(".logo-container");
    const body = document.body;

    if (!logo) return;

    // Mark body as intro-active BEFORE anything renders
    body.classList.add("logo-intro-active");

    // Capture original placement
    const placeholder = document.createElement("div");
    placeholder.style.width = `${logo.offsetWidth}px`;
    placeholder.style.height = `${logo.offsetHeight}px`;
    logo.parentNode.insertBefore(placeholder, logo.nextSibling);

    const originalStyles = {
        position: logo.style.position || "",
        top: logo.style.top || "",
        left: logo.style.left || "",
        transform: logo.style.transform || "",
        zIndex: logo.style.zIndex || ""
    };

    // Force logo immediately visible and centered
    logo.style.position = "fixed";
    logo.style.top = "50%";
    logo.style.left = "50%";
    logo.style.transform = "translate(-50%, -50%)";
    logo.style.zIndex = "10000";
    logo.style.transition = "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1), left 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

    // Let browser paint once before timing starts
    requestAnimationFrame(() => {
        setTimeout(() => {
            const rect = placeholder.getBoundingClientRect();

            logo.style.top = `${rect.top + rect.height / 2}px`;
            logo.style.left = `${rect.left + rect.width / 2}px`;
            logo.style.transform = "translate(-50%, -50%)";

            setTimeout(() => {
                // Restore original layout
                logo.style.position = originalStyles.position;
                logo.style.top = originalStyles.top;
                logo.style.left = originalStyles.left;
                logo.style.transform = originalStyles.transform;
                logo.style.zIndex = originalStyles.zIndex;

                placeholder.remove();
                body.classList.remove("logo-intro-active");
            }, 1200);
        }, 3000);
    });
});