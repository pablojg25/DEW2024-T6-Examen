const projectList = document.getElementById("projectList");
const detailsDiv = document.getElementById("detailProject");
const projectName = document.querySelector("#detailProject h3");
const description = document.getElementById("description");
const taskCount = document.getElementById("taskCount");
const totalHours = document.getElementById("totalHours");
const taskButton = document.getElementById("showTasks");
const taskList = document.getElementById("tasksList");
const deleteButton = document.getElementById("deleteProject");

let currentProject = "";

getProjects();

async function getProjects () {
    let response = await fetch("http://localhost:3000/api/project");
    let projects = await response.json();
    projects.forEach(project => {
        renderProjects(project);
    })
}

function renderProjects (project) {
    const li = document.createElement("li");
    li.dataset.id = project.id;
    li.textContent = project.name;
    projectList.append(li);
    li.addEventListener("click", (e) => {
        getProjectDetails(e.target.dataset.id);
        currentProject = e.target.dataset.id;
    })
}

async function getProjectDetails (id) {
    let response = await fetch("http://localhost:3000/api/project/" + id);
    let details = await response.json();
    renderDetails(details);
}

function renderDetails (details) {
    detailsDiv.classList.remove("hidden");
    projectName.textContent = details.name;
    description.textContent = details.description;
    taskCount.textContent = details.taskCount;
    totalHours.textContent = details.totalHours;
    taskList.innerHTML = "";
    if (details.taskCount == 0) {
        taskButton.classList.add("hidden");
        taskList.classList.add("hidden");
    } else {
        taskButton.classList.remove("hidden");
        getProjectTasks(details.id);
    }
}

async function getProjectTasks (id) {
    let response = await fetch(`http://localhost:3000/api/project/${id}/task`);
    let tasks = await response.json();
    tasks.forEach(task => renderTask(task));
}

function renderTask (task) {
    const li = document.createElement("li");
    li.textContent = `Tarea: ${task.concept} | Horas: ${task.duration}`;
    taskList.append(li);
}

taskButton.addEventListener("click", () => {
    if ([...taskList.classList].includes("hidden")) taskList.classList.remove("hidden")
    else taskList.classList.add("hidden");
})

deleteButton.addEventListener("click", () => {
    let options = {method: "DELETE"};
    fetch("http://localhost:3000/api/project/" + currentProject, options)
    .then(res => {
        if (res.status == 204) {
            alert("El proyecto se borró con éxito.");
            document.querySelector(`li[data-id = "${currentProject}"]`).remove();
            taskList.innerHTML = currentProject = "";
            detailsDiv.classList.add("hidden");
        } else {
            alert("El proyecto no se pudo borrar, todavía tiene tareas asignadas.");
        }
    })
})