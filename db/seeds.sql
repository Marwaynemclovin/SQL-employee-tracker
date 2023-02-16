USE employee_db;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Marketing'),
    ('Information Technology'),
    ('Engineering');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Manager', 100000, 1),
    ('Sales', 80000, 1),
    ('Marketing Director', 120000, 2),
    ('IT Manager', 100000, 3),
    ('IT', 85000, 3),
    ('Engineer Manager', 125000, 4),
    ('Engineer', 90000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Marwin', 'Manlangit', 1, NULL),
    ('Selina', 'Shin', 2, 1),
    ('Christian', 'Duong', 3, NULL),
    ('Chris', 'Merciadiadez', 4, 3),
    ('Adrian', 'Dumbrique', 4, 3),
    ('Eric', 'Tan', 5, NULL),
    ('Jonathan', 'Le', 6, 5),
    ('Alice', 'Tuong', 6, 5),
    ('Chloe', 'Truong', 7, NULL),
    ('Caleb', 'Gara', 7, 8);