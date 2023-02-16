const start = async () => {
  const { prompt } = await import('inquirer');
}

const db = require("./db");
const cTable = require("console.table");

require("dotenv").config();
require("console.table");

teamStart();


function teamStart() {
  runPrompts();
}

function runPrompts() {
  prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      {
        name: "View all employees",
        value: "VIEW_EMPLOYEES",
      },
      {
        name: "View all employees by department",
        value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
      },
      {
        name: "View all employees by manager",
        value: "VIEW_EMPLOYEES_BY_MANAGER",
      },
      {
        name: "Add an employee",
        value: "CREATE_EMPLOYEE",
      },
      {
        name: "Update an employee role",
        value: "UPDATE_EMPLOYEE_ROLE",
      },
      {
        name: "Add a department",
        value: "CREATE_DEPARTMENT",
      },
      {
        name: "Exit",
        value: "QUIT",
      },
    ],
  }).then((res) => {
    let action = res.action;
    switch (action) {
      case "VIEW_EMPLOYEES":
        viewEmployees();
        break;
      case "VIEW_EMPLOYEES_BY_DEPARTMENT":
        viewEmployeesByDepartment();
        break;
      case "VIEW_EMPLOYEES_BY_MANAGER":
        viewEmployeesByManager();
        break;
      case "CREATE_EMPLOYEE":
        createEmployee();
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployee();
        break;
      case "CREATE_DEPARTMENT":
        createDepartment();
        break;
      default:
        quit();
    }
  });
}

function viewEmployees() {
  db.allEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => runPrompts());
}

function viewEmployeesByDepartment() {
  db.allDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department?",
        choices: departmentChoices,
      },
    ])
      .then((res) =>
        db.allEmployeesByDepartment(res.departmentId).then(([rows]) => {
          let employees = rows;
          console.log("\n");
          console.table(employees);
        })
      )
      .then(() => runPrompts());
  });
}

function viewEmployeesByManager() {
  db.allEmployees().then(([rows]) => {
    let employees = rows;
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which employee?",
        choices: managerChoices,
      },
    ])
      .then((res) =>
        db.allEmployeesByManager(res.managerId).then(([rows]) => {
          let employees = rows;
          console.log("\n");
          if (employees.length === 0) {
            console.log("The selected employee has no direct reports");
          } else {
            console.table(employees);
          }
        })
      )
      .then(() => runPrompts());
  });
}

function createEmployee() {
    let employee = {};
    prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name:"
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name:"
      }
    ])
      .then(res => {
        let { firstName, lastName } = res;
        employee.first_name = firstName;
        employee.last_name = lastName;
        return db.allDepartments();
      })
      .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id
        }));
        return prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Choose the employee's department:",
            choices: departmentChoices
          }
        ]);
      })
      .then(res => {
        let departmentId = res.departmentId;
        employee.department_id = departmentId;
        return db.allRoles();
      })
      .then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id
        }));
        return prompt([
          {
            type: "list",
            name: "roleId",
            message: "Choose the employee's role:",
            choices: roleChoices
          }
        ]);
      })
      .then(res => {
        let roleId = res.roleId;
        employee.role_id = roleId;
        return db.addEmployee(employee);
      })
      .then(() => console.log(`Added employee to the database`))
      .then(() => runPrompts())
      .catch(err => console.log(err));
  }
  
  function createDepartment() {
    prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:"
      }
    ])
      .then(res => {
        let departmentName = res.departmentName;
        return db.addDepartment(departmentName);
      })
      .then(() => console.log(`Added department to the database`))
      .then(() => runPrompts())
      .catch(err => console.log(err));
  }