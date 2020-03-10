USE bamazon_DB;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments(
	id INTEGER NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100),
    over_head_costs INTEGER,
    PRIMARY KEY (id)
);

INSERT INTO departments (department_name, over_head_costs) VALUES('entertainment', 20000);
INSERT INTO departments (department_name, over_head_costs) VALUES('home and kitchen', 21000);
INSERT INTO departments (department_name, over_head_costs) VALUES('grocery', 40000);
INSERT INTO departments (department_name, over_head_costs) VALUES('appliances', 25000);
