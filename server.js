// import inquirer for prompt
const express = require("express");
const inquirer = require("inquirer");
const db = require('./db');
const { start } = require("repl");
const { log } = require("console");
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
// functions for help with console.log 
function startSection(name){
    console.log(`================================${name} start =============================`)
}
function endSection(name){
    console.log(`================================${name} end =============================`)
}

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
                viewAllDept();
                break;
            case 'ADD_DEPARTMENT':
                addDept();
                break;
            case 'DELETE_DEPARTMENT':
                deleteDepartment();
                break;
            case 'VIEW_ROLE':
                 viewAllRole();
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

async function addRole() {
    const { rows } = await db.searchAllDepartments();
    let departments = rows;
    const departmentChoices = departments.map(({ id, dept_name}) => ({
        name: dept_name,
        value: id,
    }))
    startSection(departmentChoices);
    const res = await inquirer.prompt([
        {
            name: 'role_name',
            message: 'What is the name of the new role?',

        },
        {
            name: 'role_salary',
            message: `What is the salary of this new role?`
            
        },
        {
            type: 'list',
            name: 'role_dept',
            message: 'What department does this role belong to?',
            choices: departmentChoices,
        },

    ]); 
    endSection(res);
    await db.createRole(res)
    .then(() => console.log(`Added ${role.role_name} to database`));
    await presentFirstPrompt();
    
}
















































// View all employees belonging to a department
function viewEmployeesByDepartment() {
    db.searchAllDepartments()
    .then(({ rows })=> {
        console.log("First promise after search ALl departments");
        console.log(rows)
        let departments = rows;
        const departmentChoices = departments.map(({ id, dept_name }) => ({ // id and dept_name are the naming from schmea
            name: dept_name,
            value: id,
        }));
        console.log(departmentChoices);
        inquirer.prompt([
            {
                type: 'list',
                name: 'dept_Id',
                message: 'Which department of employees do you want to see?',
                choices: departmentChoices,
                
            },
            
        ])
        .then((res) => { // curly brackets to be able to console log 
            startSection("Response to department choices")
            console.log(res);
            endSection("Response to department choices")
            return db.searchEmployeesByDepartment(res.dept_Id)
        })
        .then(({ rows }) => {
            let employees = rows;
            console.log('Logging employees');
            console.table(employees);
        })
    
            .then(() => presentFirstPrompt());
            
    });
}
//async function to view employees by department 
async function empByDept(){
    const departmentData = await db.searchAllDepartments()
    let departments = departmentData.rows;
    const departmentChoices = departments.map(({ id, dept_name }) => ({ // id and dept_name are the naming from schmea
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



//initilize app


