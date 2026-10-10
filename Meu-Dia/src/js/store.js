
const STORAGE_KEY = "tasks";
 
function load() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return []; // se o JSON salvo estiver corrompido, começa vazio em vez de quebrar
    }
}
 
let tasks = load(); // variável privada do módulo: ninguém de fora acessa direto
 
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
 
// Sistema de avisos usando eventos nativos do navegador 
export function notify() {
    document.dispatchEvent(new Event("state:changed")); // "grita" que algo mudou
}
 
export function onChange(callback) {
    document.addEventListener("state:changed", callback); // "escuta" o grito
}
 
//  Leitura das tarefas e estatísticas
export const getTasks = () => tasks;
 
export function getStats() {
    const total = tasks.length;
    const done = tasks.filter(task => task.done).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pending: total - done, percent };
}
 
// Escrita: toda mudança segue "altera, salva, avisa" 
export function addTask(data) {
    tasks.push({ id: Date.now(), done: false, ...data }); // "...data" espalha os campos
    save();
    notify();
}
 
export function toggleTask(id) {
    const task = tasks.find(item => item.id === id); // find devolve o 1º que combina
    if (!task) return;
    task.done = !task.done;
    save();
    notify();
}
 
export function removeTask(id) {
    tasks = tasks.filter(item => item.id !== id);
    save();
    notify();
}
 
export function clearDone() {
    tasks = tasks.filter(task => !task.done);
    save();
    notify();
}
 

