const connection = require("./connection");

class employeeDB {

    constructor(connection) {
        this.connection = connection;
    }

    // Show all employees
    async allEmployees() {
        try {
            const result = await this.connection.promise().query(
                "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
            );
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error getting all employees");
        }
    }


    // Add an employee
    async addEmployee(employee) {
        try {
            if (!employee.first_name || !employee.last_name || !employee.role_id) {
                throw new Error("Employee object must include first_name, last_name, and role_id properties");
            }

            const result = await this.connection.promise().query("INSERT INTO employee SET ?", employee);

            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error adding employee");
        }
    }

    // Update the given employee's role
    async updateEmployeeRole(employeeId, roleId) {
        try {
            if (!employeeId || !roleId) {
                throw new Error("Employee ID and Role ID are required to update the employee's role");
            }

            const result = await this.connection.promise().query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [roleId, employeeId]
            );

            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error updating employee's role");
        }
    }



    // Show all managers
    async allManagers(employeeId) {
        try {
            if (!employeeId) {
                throw new Error("Employee ID is required to get all managers");
            }

            const result = await this.connection.promise().query(
                "SELECT id, first_name, last_name FROM employee WHERE id != ?",
                employeeId
            );

            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error getting all managers");
        }
    }


    // Show all roles
    async allRoles() {
        try {
            const result = await this.connection.promise().query(
                "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
            );
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error getting all roles");
        }
    }


    // Create a new role
    async addRole(role) {
        try {
            if (!role.title || !role.salary || !role.department_id) {
                throw new Error("Role object must include title, salary, and department_id properties");
            }

            const result = await this.connection.promise().query("INSERT INTO role SET ?", role);

            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error creating role");
        }
    }


    // Show all departments
    async allDepartments() {
        try {
            const result = await this.connection.promise().query(
                "SELECT department.id, department.name FROM department;"
            );
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error getting all departments");
        }
    }


    // Add a department
    async addDepartment(department) {
        try {
            if (!department.name) {
                throw new Error("Department object must include a name property");
            }

            const result = await this.connection.promise().query("INSERT INTO department SET ?", department);

            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error adding department");
        }
    }
}


module.exports = new employeeDB(connection);