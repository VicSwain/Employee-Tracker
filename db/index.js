const pool = require('./connection');

class DB {
  constructor() {}

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  searchAllEmployees() {
    return this.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;"
    );
  }
  
  searchAllDepartments() {
    return this.query('SELECT department.id, department.dept_name FROM department;');
  }
  
  searchAllRole() {
    return this.query('SELECT role.id, role.title, department.dept_name AS department, role.salary FROM role LEFT JOIN department on role.dept_id = department.id;');
  }
  
  searchAllDepartments() {
    return this.query('SELECT * FROM department;');
  }

  createDept(department) {
    return this.query('INSERT INTO department (dept_name) VALUES ($1)', [department.dept_name]);
  }

  createRole(role) {
    const { title, salary, dept_id } = role;
    console.log(role);
    return this.query(
      'INSERT INTO role (title, salary, dept_id) VALUES ($1, $2, $3)',
      [title, salary, dept_id]
    );
  }

  // Create a new employee
  createEmployee(employee) {
    const { first_name, last_name, role_id, manager_id } = employee;
    return this.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
  }

  updateEmployeeRole(employeeId, roleId) {
    return this.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
      roleId,
      employeeId,
    ]);
  }

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  searchEmployeesByDepartment(dept_Id) {
    console.log("Searching by department for employees: ",dept_Id)
    return this.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department ON role.dept_id = department.id WHERE department.id = $1;", 
        [dept_Id]   
         
    ); 
  }   

 
}
 
   

  module.exports = new DB();




//   "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;"


// 'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department department ON role.dept_id = dept.id WHERE dept.id = $1;',
//         [dept_id]