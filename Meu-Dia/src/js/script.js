// ponto de entrada do código JS, carrega os pedaços do código que estão em outros arquivos ex: html e liga cada mudulo de JS com o HTML correspondente

import {loadComponets} from '../utils/loadComponents.js';
import {formatTodayDate} from '../utils/formatters.js';

import {initSidebar} from '../components/sidebar/sidebar.js';
import {initHeader} from '../components/header/header.js';
import {initFooter} from '../components/footer/footer.js';

import {initTaskList} from '../js/taskList.js';
import {initStats} from '../js/stats.js';
import {initToolbar} from '../js/toolbar.js';
import {initDialog} from '../js/dialog.js';

async function start() {
    // Carrega os 4 HTMLs ao mesmo tempo e espera TODOS terminarem
    await Promise.all([
        loadComponent("#sidebar", "/src/components/sidebar/sidebar.html"),
        loadComponent("#header", "/src/components/header/header.html"),
        loadComponent("#page", "/src/pages/meu-dia.html"),
        loadComponent("#footer", "/src/components/footer/footer.html")
    ]);

        // Só agora os elementos existem, então podemos ligar a lógica deles
    document.getElementById("todayLabel").textContent = formatToday();
 
    initSidebar();
    initHeader();
    initFooter();
    initStats();
    initToolbar();
    initTaskList();
    initDialog();
}

// Função auxiliar para carregar um componente HTML e inserir no DOM
start().catch(error => console.error("Erro ao iniciar:", error));