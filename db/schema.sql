--ensure db does not previously exists
DROP DATABASE IF EXISTS employees_db WITH (FORCE);
--create employees_db
CREATE DATABASE employees_db;
--connect to empoyees_db
\c employees_db;

--create department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

--create role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    dept_id INTEGER NOT NULL,
    FOREIGN KEY (dept_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);
--create employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);
