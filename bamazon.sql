DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;
USE bamazon_DB;

CREATE TABLE products(
	id INTEGER NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10, 4),
    stock_quantity DECIMAL(10, 2),
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('Xbox One X', 'entertainment', 299.99, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('Playstation 4', 'entertainment', 249.99, 45);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('Macbook Pro', 'entertainment', 1299.99, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('4k Television', 'entertainment', 499.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('Cast Iron Skillet', 'home and kitchen', 9.99, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('Coffee Mug', 'home and kitchen', 4.99, 14);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('La Croix 12pk plain', 'grocery', 4.99, 6);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('Snickers bars', 'grocery', 1.50, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('Kraft Mac and Cheese', 'grocery', 1.99, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('GE Range', 'appliances', 499.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('GE Refrigerator', 'appliances', 799.99, 50);
