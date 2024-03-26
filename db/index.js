const pool = require('./connection');

class DB {
  constructor() {}
// async function to  execute SQL queries
  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

//function to search all employees
  searchAllEmployees() {
    return this.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;"
    );
  }

//function to search all departments
  searchAllDepartments() {
    return this.query('SELECT department.id, department.dept_name FROM department;');
  }

//function to search all roles
  searchAllRole() {
    return this.query('SELECT role.id, role.title, department.dept_name AS department, role.salary FROM role LEFT JOIN department on role.dept_id = department.id;');
  }

// function to create a new department
  createDept(department) {
    return this.query('INSERT INTO department (dept_name) VALUES ($1)', [department.dept_name]);
  }

//function to create a new role
  createRole(role) {
    const { title, salary, dept_id } = role;
    console.log(role);
    return this.query(
      'INSERT INTO role (title, salary, dept_id) VALUES ($1, $2, $3)',
      [title, salary, dept_id]
    );
  }

//function to create a new employee
  createEmployee(employee) {
    const { first_name, last_name, role_id, manager_id } = employee;
    return this.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
  }

// function to update an employee role
  updateEmployeeRole(employeeId, roleId) {
    return this.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
      roleId,
      employeeId,
    ]);
  }

// function to search employess by deptartment 
  searchEmployeesByDepartment(dept_Id) {
    return this.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department ON role.dept_id = department.id WHERE department.id = $1;", 
        [dept_Id]   
         
    ); 
  }  
}   

  module.exports = new DB();