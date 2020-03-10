const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootpass',
    database: 'bamazon_DB'
});

function promptUser() {  
    inquirer 
        .prompt([
            {
                type: 'list',
                message: 'Select task...',
                choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
                name: 'task'
            }
        ])
        .then(function(res) {
            switch (res.task) {
                case 'View Product Sales by Department':
                    console.clear();
                    viewSales();
                    break;
                case 'Create New Department':
                    console.clear();
                    createDepartment();
                    break;
                case 'Exit':
                    process.exit();
            } 
        });
}

function viewSales() {
    var query;
    connection.query('SELECT departments.department_name, SUM(products.product_sales) AS product_sales FROM products LEFT JOIN departments ON products.department_name = departments.department_name GROUP BY department_name', function(err, res) {
        if (err) throw err;
        console.table(res);
    });
}

promptUser();