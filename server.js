// import inquirer for prompt
const express = require("express");
const inquirer = require("inquirer");
const db = require('./db');
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
init();
function init() {
    //print CLI logo
    logoCli.print(logoConfig);
    presentFirstPrompt();
}

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
                    name: "View all employees by manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER",
                },
                {
                    name: "Add an employee",
                    value: "ADD_EMPLOYEE",
                },
                {
                    name: "Delete an employee",
                    value: "DELETE_EMPLOYEE",
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
                    name: "View employees by department",
                    value: "VIEW_EMPLOYEE_DEPARTMENT",
                },
                {
                    name: "Delete department",
                    value: "DELETE_DEPARTMENT",
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
                    name: "Delete a role",
                    value: "DELETE_ROLE",
                },
                {
                    name: "Total utilized budget by department",
                    value: "VIEW_TOTAL_UTILIZED_BUDGET_BY_DEPARTMENT",
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
            case 'VIEW_EMPLOYEES_BY_MANAGER':
                viewEmployeesByManager();
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'DELETE_EMPLOYEE':
                deleteEmployee();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
                break;
            case 'VIEW_DEPARTMENT':
                viewDepartment();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'DELETE_DEPARTMENT':
                deleteDepartment();
                break;
            case 'VIEW_ROLE':
                viewRole();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'DELETE_ROLE':
                deleteRole();
                break;
            case 'VIEW_TOTAL_UTILIZED_BUDGET_BY_DEPARTMENT':
                viewTotalUtilizedBudgetByDepartment();
                break;
            case 'QUIT':
                quit();
                break;
        }
    });
};
//View all employees
function viewEmployees() {
    db.searchAllEmployees()
    .then(({ rows }) => {
        let employees = rows;
        console.table(employees);
    })
    .then(() => presentFirstPrompt());
}
// View all employees belonging to a department
function viewEmployeesByDepartment() {
    db.searchEmployeesByDepartment()
    .then(({ rows})=> {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id,
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept_id',
                message: 'Which department of employees do you want to see?',
                choices: departmentChoices,
            },
        ])
        .then((res) => db.searchEmployeesByDepartment(res.dept_id))
        .then(({ rows }) => {
            let employees = rows;
            console.table(employees);
        })
            .then(() => presentFirstPrompt());

    });
}


//initilize app


