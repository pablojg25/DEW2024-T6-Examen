const main = document.querySelector("main");
let employees = [];
if (sessionStorage.employees) employees = JSON.parse(sessionStorage.employees);
let total = 0;
let employeeAssignments = [];
let tasks = [];

getAssignments();

async function getAssignments() {
    let response = await fetch("http://localhost:3000/api/assignment");
    let data = await response.json();
    filterAssignments(data);
}

function filterAssignments(data) {
    [...data].forEach(assignment => {
        if (employees.includes(assignment.employee_id)) {
            if (employeeAssignments[assignment.employee_id]) {
                employeeAssignments[assignment.employee_id].push(assignment.task_id);
            } else {
                employeeAssignments[assignment.employee_id] = [assignment.task_id];
            }
        };
    })
}

fetch("http://localhost:3000/api/task")
.then(res => res.json())
.then(data => tasks = data);

employees.forEach(employee => getEmployee(employee));

async function getEmployee(id) {
    let response = await fetch("http://localhost:3000/api/employee/" + id);
    let employee = await response.json();
    renderEmployee(employee);
}

function renderEmployee(employee) {
    const div = document.createElement("div");
    let employeeTasks = [...tasks].filter(task => { return employeeAssignments[employee.id].includes(task.id)});
    let totalCost = 0;
    div.id = "employee-" + employee.id;

    const name = document.createElement("h2");
    name.textContent = employee.name;

    const blockquote = document.createElement("blockquote");
    const role = document.createElement("p");
    role.textContent = "Cargo: " + employee.role;
    const cost = document.createElement("p");
    cost.textContent = "Coste: " + employee.hourCost + "€/hora";
    const fullCost = document.createElement("h3");
    
    const taskList = document.createElement("ul");
    taskList.classList.add("tasksCostList");
    
    employeeTasks.forEach(task => {
        totalCost += task.duration;
        const li = document.createElement("li");
        li.textContent = `${task.concept}: ${task.duration} horas`;
        taskList.append(li);
    })
    totalCost *= employee.hourCost;
    total += totalCost;

    fullCost.textContent = `Coste empleado: ${totalCost.toFixed(2)}€`;
    blockquote.append(role,cost,taskList,fullCost);
    div.append(name,blockquote);
    main.append(div);
}