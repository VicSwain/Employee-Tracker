// import inquirer for prompt
const express = require("express");
const inquirer = require("inquirer");
const db = require('./db');
const { start } = require("repl");
const { log } = require("console");
const { title } = require("process");
const app = express();
//styling for CLI
const logoCli = require("cli-logo"),
    version = "v" + require("./package.json").version,
    description = require("./package.json").description;
logoConfig = {
    name: "Employee Manager",
    type: "Ghost",
    color: "brightMagenta",    
};
//initial app
init();

function init() {
    //print CLI logo
    logoCli.print(logoConfig);
    presentFirstPrompt();
}
// initial prompts for user to choose what operation they want to perform
function presentFirstPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do first?",
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
                    name: "Add an employee",
                    value: "ADD_EMPLOYEE",
                },
                {
                    name: "Update an employee role",
                    value: "UPDATE_EMPLOYEE_ROLE",
                },
                {
                    name: "View all departments",
                    value: "VIEW_DEPARTMENT",
                },
                {
                    name: "Add a department",
                    value: "ADD_DEPARTMENT",
                },
                {
                    name: "View all roles",
                    value: "VIEW_ROLE",
                },
                {
                    name: "Add a role",
                    value: "ADD_ROLE",
                },
                {
                    name: "Quit",
                    value: "QUIT",
                },
            ],
        },
    ]).then((res) => {
        let choice = res.choice;
//switch statement to call repsective function based on user input
        switch (choice) {
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                viewEmployeesByDepartment();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
                break;
            case 'VIEW_DEPARTMENT':
                viewAllDept();
                break;
            case 'ADD_DEPARTMENT':
                addDept();
                break;
            case 'VIEW_ROLE':
                 viewAllRole();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'QUIT':
                quit();
                break;
        }
    });
};

// async function to view all departments
async function viewAllDept() {
    const deptData = await db.searchAllDepartments()
    let departments = deptData.rows;
    console.table(departments);
    presentFirstPrompt()
}
// async function to see all employees
async function viewEmployees() {
    const employeeData = await db.searchAllEmployees()
    let employees = employeeData.rows;
    console.table(employees)   
    presentFirstPrompt()
}
//async function to see all roles
async function viewAllRole() {
    const roleData = await db.searchAllRole()
    let roles = roleData.rows;
    console.table(roles)
    presentFirstPrompt()
}
//async function to add a department 
async function addDept() {
     const res = await inquirer.prompt([
        {
            name: 'dept_name',
            message: 'What is the name of the new department?'
        },
    ]);
   let deptRes = res;
    await db.createDept(deptRes)
    .then(() => console.log(`Added ${deptRes.dept_name} to the database`));
    await presentFirstPrompt();
}
// async function to add a role with prompts to fill in all need information for the role
async function addRole() {
    const { rows } = await db.searchAllDepartments();
    let departments = rows;
    const departmentChoices = departments.map(({ id, dept_name}) => ({
        name: dept_name,
        value: id,
    }))
    const res = await inquirer.prompt([
        {
            name: 'title',
            message: 'What is the name of the new role?',

        },
        {
            name: 'salary',
            message: `What is the salary of this new role?`
            
        },
        {
            type: 'list',
            name: 'dept_id',
            message: 'What department does this role belong to?',
            choices: departmentChoices,
        },

    ]); 
    
    await db.createRole(res)
    .then(() => console.log(`Added ${res.title} to database`));
    await presentFirstPrompt();
    
}
// async function to add an employee
async function addEmployee() {
    try {
      const employeeDetails = await inquirer.prompt([
        {
          name: 'first_name',
          message: "What is the employee's first name?",
        },
        {
          name: 'last_name',
          message: "What is the employee's last name?",
        },
      ]);
  
      const { first_name: firstName, last_name: lastName } = employeeDetails;
  
      const { rows: roles } = await db.searchAllRole();
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
  
      const roleResponse = await inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: "What is the employee's role?",
        choices: roleChoices,
      });
  
      const roleId = roleResponse.roleId;
  
      const { rows: employees } = await db.searchAllEmployees();
      const managerChoices = employees.map(
        ({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        })
      );
      managerChoices.unshift({ name: 'None', value: null });
  
      const managerResponse = await inquirer.prompt({
        type: 'list',
        name: 'managerId',
        message: "Who is the employee's manager?",
        choices: managerChoices,
      });
  
      const employee = {
        manager_id: managerResponse.managerId,
        role_id: roleId,
        first_name: firstName,
        last_name: lastName,
      };
  
      await db.createEmployee(employee);
  
      console.log(`Added ${firstName} ${lastName} to the database`);
      await presentFirstPrompt();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }
// async function to update an employee role
  async function updateEmployeeRole() {
    try {
      const { rows } = await db.searchAllEmployees();
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
  
      const { employeeId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: "Which employee's role do you want to update?",
          choices: employeeChoices,
        },
      ]);
  
      const { rows: roleRows } = await db.searchAllRole();
      let roles = roleRows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
  
      const { roleId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Which role do you want to assign the selected employee?',
          choices: roleChoices,
        },
      ]);
  
      await db.updateEmployeeRole(employeeId, roleId);
      console.log("Updated employee's role");
      presentFirstPrompt();
    } catch (error) {
      console.error('Error updating employee role:', error);
    }
  }

//   exit the app
function quit() {
    console.log("Until I'm needed again!");
    process.exit();
}

//async function to view employees by department 
async function viewEmployeesByDepartment() {
    const departmentData = await db.searchAllDepartments()
    let departments = departmentData.rows;
    const departmentChoices = departments.map(({ id, dept_name }) => ({
        name: dept_name,
        value: id,
    }));
    const {dept_Id} = await inquirer.prompt([
        {
            type: 'list',
            name: 'dept_Id',
            message: 'Which department of employees do you want to see?',
            choices: departmentChoices,
            
        },
    ])
    const employeeData = await db.searchEmployeesByDepartment(dept_Id)
    console.table(employeeData.rows)
    presentFirstPrompt()
}





