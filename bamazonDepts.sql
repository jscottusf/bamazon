USE bamazon_DB;

CREATE TABLE departments(
	id INTEGER NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100),
    over_head_costs INTEGER,
    PRIMARY KEY (id)
);

INSERT INTO departments (department_name, over_head_costs) VALUES('Entertainment', 10000);
INSERT INTO departments (department_name, over_head_costs) VALUES('Home and Kicthen', 20000);
INSERT INTO departments (department_name, over_head_costs) VALUES('Grocery', 16000);
INSERT INTO departments (department_name, over_head_costs) VALUES('Appliances', 23000);
