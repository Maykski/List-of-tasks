import { loadComponent } from "../../utils/loadComponent.js";

export async function initHeader() {
    // fetch parte da página (index.html, que está em src/)
    await loadComponent("#header-placeholder", "components/header/header.html");
}