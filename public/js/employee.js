const employeeList = document.getElementById("employeeList");
const markedEmployees = document.getElementsByClassName("marked");

getEmployees();

async function getEmployees() {
    let response = await fetch("http://localhost:3000/api/employee");
    let employees = await response.json();
    employees.forEach(employee => {
        renderEmployee(employee);
    })
}

function renderEmployee(employee) {
    const li = document.createElement("li");
    li.dataset.id = employee.id;
    li.textContent = `${employee.name} | ${employee.role} | ${employee.hourCost}€/hora`;
    li.addEventListener("click", (e) => {
        if ([...e.target.classList].includes("marked")) {
            e.target.classList.remove("marked");
        } else {
            e.target.classList.add("marked");
        }
        updateSessionEmployees();
    })
    if (sessionStorage.employees && sessionStorage.employees.includes(employee.id)) li.classList.add("marked");
    employeeList.append(li);
}

function updateSessionEmployees () {
    sessionStorage.employees = JSON.stringify(
        [...markedEmployees].map(employee => parseInt(employee.dataset.id))
    );
    console.log(JSON.parse(sessionStorage.employees));
}