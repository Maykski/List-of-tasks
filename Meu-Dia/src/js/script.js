import { initHeader } from "../components/header/header.js";
import { initSidebar } from "../components/sidebar/sidebar.js";

// ELEMENTOS
const taskForm = document.getElementById("taskForm");
const taskText = document.getElementById("taskText");
const taskList = document.getElementById("taskList");

const emptyState = document.getElementById("emptyState");
const clearCompleted = document.getElementById("clearCompleted");
const formDialog = document.getElementById("formDialog");

const tabs = document.querySelectorAll(".tab"); // Todas / Pendentes / Concluídas

// Calendário
const calendarTitle = document.getElementById("calendarTitle");
const calendarDays = document.getElementById("calendarDays");
const selectedDateLabel = document.getElementById("selectedDateLabel");

// ESTADO
let viewYear = 0;
let viewMonth = 0;
let selectedDate = "";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTab = "all";
let searchTerm = "";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// FUNÇÕES AUXILIARES

// Formata a data de yyyy-mm-dd para dd/mm/yyyy
function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}

// Monta uma data no formato yyyy-mm-dd (monthIndex começa em 0)
function toISO(year, monthIndex, day) {
    const month = String(monthIndex + 1).padStart(2, "0");
    const dayText = String(day).padStart(2, "0");
    return `${year}-${month}-${dayText}`;
}

// Data de hoje no formato yyyy-mm-dd
function todayISO() {
    const now = new Date();
    return toISO(now.getFullYear(), now.getMonth(), now.getDate());
}

// Converte a prioridade em uma classe CSS
function priorityToClass(priority) {
    switch (priority) {
        case "Alta":
            return "priority-high";
        case "Média":
            return "priority-medium";
        default:
            return "priority-low";
    }
}

// Exibe a data atual, ex.: "Quinta-feira, 18 de junho"
function showToday() {
    const text = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    document.getElementById("todayLabel").textContent =
        text.charAt(0).toUpperCase() + text.slice(1);
}

// ESTATÍSTICAS
function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("statTotal").textContent = total;
    document.getElementById("statDone").textContent = done;
    document.getElementById("statPending").textContent = total - done;
    document.getElementById("statPercent").textContent = `${percent}% do total`;
}

// RENDERIZAÇÃO
function getVisibleTasks() {
    return tasks.filter(task => {
        const matchesFilter =
            currentTab === "all" ||
            (currentTab === "done" && task.done) ||
            (currentTab === "pending" && !task.done);

        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });
}

// Cria o elemento HTML de uma tarefa
function createTaskElement(task) {
    const card = document.createElement("article");
    card.className = `task ${priorityToClass(task.priority)}`;
    if (task.done) card.classList.add("is-done");

    // Botão de marcar/desmarcar como concluída
    const check = document.createElement("button");
    check.className = "check";
    check.type = "button";
    check.textContent = task.done ? "✓" : "";
    check.setAttribute("aria-label", "Marcar como concluída");
    check.addEventListener("click", () => {
        task.done = !task.done;
        saveTasks();
        renderTasks();
    });

    // Título e prioridade
    const content = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.text;
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = task.priority;
    content.append(title, tag);

    // Data e botão de excluir
    const side = document.createElement("div");
    side.className = "task-side";
    const date = document.createElement("span");
    date.className = "task-date";
    date.textContent = formatDate(task.date);
    if (!task.done && task.date < todayISO()) date.classList.add("is-overdue");
    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "Excluir";
    remove.addEventListener("click", () => {
        tasks = tasks.filter(item => item.id !== task.id);
        saveTasks();
        renderTasks();
    });
    side.append(date, remove);

    card.append(check, content, side);
    return card;
}

// Renderiza a lista de tarefas na tela
function renderTasks() {
    const visible = getVisibleTasks();

    taskList.innerHTML = "";
    visible.forEach(task => taskList.appendChild(createTaskElement(task)));

    emptyState.style.display = visible.length === 0 ? "block" : "none";
    document.getElementById("taskCount").textContent =
        `${visible.length} ${visible.length === 1 ? "tarefa" : "tarefas"}`;

    updateStats();
}

// CALENDÁRIO
function renderCalendar() {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    calendarTitle.textContent = firstDay.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    calendarDays.innerHTML = "";

    // Espaços vazios antes do dia 1
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarDays.appendChild(document.createElement("span"));
    }

    // Um botão para cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const iso = toISO(viewYear, viewMonth, day);
        const button = document.createElement("button");

        button.type = "button";
        button.className = "day";
        button.textContent = day;

        if (iso === todayISO()) button.classList.add("is-today");
        if (iso === selectedDate) button.classList.add("is-selected");

        button.addEventListener("click", () => {
            selectedDate = iso;
            selectedDateLabel.textContent = "Prazo: " + formatDate(iso);
            renderCalendar();
        });

        calendarDays.appendChild(button);
    }
}

function changeMonth(step) {
    viewMonth += step;

    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }

    renderCalendar();
}

// BUSCA (precisa rodar depois que o header existe)
function setupSearch() {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value;
        renderTasks();
    });
}

// EVENTOS

// Abas: Todas / Pendentes / Concluídas
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        currentTab = tab.dataset.filter;
        renderTasks();
    });
});

// Abrir o modal
document.getElementById("openForm").addEventListener("click", () => {
    const now = new Date();

    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    selectedDate = todayISO();
    selectedDateLabel.textContent = "Prazo: " + formatDate(selectedDate);

    renderCalendar();
    formDialog.showModal();
    taskText.focus();
});

// Fechar o modal sem adicionar
document.getElementById("cancelForm").addEventListener("click", () => {
    formDialog.close();
});

// Navegar entre os meses
document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));

// Adicionar a tarefa
taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskText.value.trim();
    if (text === "" || selectedDate === "") return;

    tasks.push({
        id: Date.now(),
        text,
        priority: taskForm.elements.priority.value,
        date: selectedDate,
        done: false
    });

    saveTasks();
    renderTasks();
    taskForm.reset();
    formDialog.close();
});

// Limpar concluídas
clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    renderTasks();
});

// INÍCIO
async function init() {
    await initHeader();    
    await initSidebar();   
    setupSearch();
    showToday();
    renderTasks();
}

init();