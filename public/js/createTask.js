const projectSelect = document.getElementById("project");
const form = document.getElementById("taskForm");
const concept = document.getElementById("concept");
const duration = document.getElementById("duration");
const project = document.getElementById("project");

getProjects();

async function getProjects () {
    let response = await fetch("http://localhost:3000/api/project");
    let projects = await response.json();
    projects.forEach(project => {
        renderProjects(project);
    })
}

function renderProjects(project) {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    projectSelect.append(option);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        "project_id": project.value,
        "concept": concept.value,
        "duration": duration.value
    };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    }
    fetch("http://localhost:3000/api/task")
    .then(res => {
        if (!res.ok) alert("Error en la petición.")
        else {
            alert("Tarea creada con éxito.");
            form.reset();
        }
    })
})