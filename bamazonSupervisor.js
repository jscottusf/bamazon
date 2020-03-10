const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
let salesObj;
let salesArr;

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

// var query = 'SELECT departments.department_name, SUM(products.product_sales) AS product_sales FROM products ';
// query += 'LEFT JOIN departments ON products.department_name = departments.department_name GROUP BY department_name';
// SELECT product_sales MINUS SELECT over_head_costs FROM departments AS total_profit
// query += " SELECT ABS(product_sales - departments.over_head_costs) AS total_profit"
//SELECT *, 'product_sales - departments.over_head_costs' AS total_profit WHERE products.department_name = departments.department_name GROUP BY id
function viewSales() {
    var query = "SELECT departments.id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales";
    query += " FROM products LEFT JOIN departments ON products.department_name = departments.department_name";
    query += " GROUP BY id";
    connection.query(query, function(err, res) {
        if (err) throw err;
        var table = res;
        salesArr = [];
        for (var i = 0; i < table.length; i++) {
            var profit = table[i].product_sales - table[i].over_head_costs;
            salesObj = {"id": table[i].id, "Department Name": table[i].department_name, "Overhead Expenses": table[i].over_head_costs, "Product Sales":table[i].product_sales, "Total Profit": profit.toFixed(2)};
            salesArr.push(salesObj);
        }
        console.table(salesArr);
        setTimeout(promptUser, 1000)
    });
}

function createDepartment() {
    console.clear();
    inquirer 
        .prompt([
            {
                type: 'input',
                message: 'Enter New Department name',
                validate: function(value) {
                    if (isNaN(value)) {
                        return true;
                    }
                    return false;
                },
                name: 'newDept'
            },
            {
                type: 'input',
                message: 'Enter department overhead cost',
                validate: function(value) {
                    if (isNaN(value) === false && parseFloat(value) > 0) {
                        return true;
                    }
                    return false;
                },
                name: 'overhead'
            }
        ])
        .then(function(ans) {
            connection.query(
                'INSERT INTO departments SET ?',
                {
                    department_name: ans.newDept,
                    over_head_costs: ans.overhead
                }, function(err, res) {
                    if (err) throw err;
                    console.log(ans.newDept + ' added to departments\n');
                    setTimeout(promptUser, 1000);
                }
            )
        });
}

console.clear();
promptUser();