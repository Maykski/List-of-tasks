import { loadComponent } from "../../utils/loadComponent.js";

export async function initSidebar() {
    await loadComponent("#sidebar-placeholder", "components/sidebar/sidebar.html");

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle = document.getElementById("menuToggle"); // botão que está no header

    function openSidebar() {
        sidebar.classList.add("is-open");
        overlay.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
        sidebar.classList.remove("is-open");
        overlay.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", openSidebar);
    document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeSidebar();
    });
}