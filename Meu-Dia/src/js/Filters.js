import { getTasks, notify } from "./store.js";           
import { todayISO, addDays } from "../utils/formatters.js"; 


const defaults = { tab: "all", search: "", period: "any", priority: "all", sort: "time" };
const priorityOrder = { Alta: 0, Média: 1, Baixa: 2 };

let state = { ...defaults }; // cópia, para não alterar o "defaults"

export const getFilterState = () => state;

export function setFilter(key, value) {
    state[key] = value;  // colchetes: o nome da propriedade vem de uma variável
    notify();
}

// "Limpar filtros" não mexe na aba nem na busca, só nos 3 filtros do painel
export function resetFilters() {
    state = { ...state, period: defaults.period, priority: defaults.priority, sort: defaults.sort };
    notify();
}

function matchesPeriod(task) {
    const today = todayISO();

    if (state.period === "today") return task.date === today;
    if (state.period === "tomorrow") return task.date === addDays(today, 1);

    if (state.period === "week") {
        const weekday = new Date().getDay();          
        // 0 = domingo ... 6 = sábado
        const start = addDays(today, -weekday);       // domingo desta semana
        const end = addDays(today, 6 - weekday);      // sábado desta semana
        return task.date >= start && task.date <= end; // yyyy-mm-dd compara como texto
    }

    return true; // "any"
}

function sortTasks(list) {
    return [...list].sort((a, b) => {  // cópia, porque sort() altera o array
        if (state.sort === "priority") {
            return priorityOrder[a.priority] - priorityOrder[b.priority]
                || a.date.localeCompare(b.date); // empate (0 é falso): desempata pela data
        }
        if (state.sort === "alpha") return a.text.localeCompare(b.text, "pt-BR");
        return a.date.localeCompare(b.date) || a.id - b.id;
    });
}

export function getVisibleTasks() {
    const filtered = getTasks().filter(task => {
        const matchesTab =
            state.tab === "all" ||
            (state.tab === "done" && task.done) ||
            (state.tab === "pending" && !task.done);

        const matchesSearch = task.text.toLowerCase().includes(state.search.toLowerCase());
        const matchesPriority = state.priority === "all" || task.priority === state.priority;

        return matchesTab && matchesSearch && matchesPriority && matchesPeriod(task);
    });

    return sortTasks(filtered);
}