const taskForm = document.getElementById("taskForm");
const taskText = document.getElementById("taskText");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const clearCompleted = document.getElementById("clearCompleted");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(date) {
    const partes = date.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const card = document.createElement("article");
        const indicator = document.createElement("div");
        const checkbox = document.createElement("input");
        const content = document.createElement("div");
        const title = document.createElement("h3");
        const badge = document.createElement("span");
        const date = document.createElement("p");
        const deleteButton = document.createElement("button");


        card.className = "task-card";
        indicator.className = "priority-indicator";
        checkbox.className = "task-checkbox";
        content.className = "task-content";
        title.className = "task-title";
        badge.className = "priority-badge";
        date.className = "task-date";
        deleteButton.className = "delete-button";


        if (task.priority === "Alta") {

            card.classList.add("priority-high");

        } else if (task.priority === "Média") {

            card.classList.add("priority-medium");

        } else {

            card.classList.add("priority-low");

        }

        if (task.done) {
            card.classList.add("is-done");
        }


        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        title.textContent = task.text;

        badge.textContent = task.priority;

        date.textContent =
            "Prazo: " + formatDate(task.date);

        deleteButton.textContent = "Excluir";


        // MARCAR COMO CONCLUÍDA
        checkbox.addEventListener("change", function() {

            task.done = checkbox.checked;

            saveTasks();
            renderTasks();

        });


        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {

                return item.id !== task.id;

            });

            saveTasks();
            renderTasks();

        });


        content.appendChild(title);
        content.appendChild(badge);
        content.appendChild(date);

        card.appendChild(indicator);
        card.appendChild(checkbox);
        card.appendChild(content);
        card.appendChild(deleteButton);

        taskList.appendChild(card);

    });


    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }
}


taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const task = {

        id: Date.now(),

        text: taskText.value.trim(),

        priority: taskPriority.value,

        date: taskDate.value,

        done: false

    };


    if (task.text === "" || task.date === "") {
        return;
    }


    tasks.push(task);

    saveTasks();

    renderTasks();


    taskForm.reset();

    taskPriority.value = "Média";

});


clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return !task.done;

    });

    saveTasks();

    renderTasks();

});


renderTasks();