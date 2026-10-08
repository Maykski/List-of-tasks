// Busca um arquivo HTML e coloca dentro de um elemento da página
export async function loadComponent(selector, url) {
    const target = document.querySelector(selector);
    const response = await fetch(url);

    if (!response.ok) {
        console.error(`Não foi possível carregar ${url}`);
        return;
    }

    target.innerHTML = await response.text();
}