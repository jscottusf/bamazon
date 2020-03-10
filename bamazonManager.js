//View Products for Sale// View Low Inventory// Add to Inventory// Add New Product
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
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
                name: 'task'
            }
        ])
        .then(function(res) {
            switch (res.task) {
                case 'View Products for Sale':
                    console.clear();
                    viewProducts();
                    break;
                case 'View Low Inventory':
                    console.clear();
                    lowInventory();
                    break;
                case "Add to Inventory":
                    orderPrompt();
                    break;
                case 'Add New Product':
                    newProduct();
                    break;
                case 'Exit':
                    process.exit();
            } 
        });
}

function viewProducts() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.table(res);
        setTimeout(promptUser, 1000);
    });
}

function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
        if (err) throw err;
        console.table(res);
        setTimeout(promptUser, 1000);
    });
}

function orderPrompt() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                question: 'Select product to order',
                choices: function() {
                    var products = [];
                    for (var i = 0; i < res.length; i++) {
                        products.push(res[i].product_name);
                    }
                    return products;
                },
                name: 'order'
            },
            {
                type: 'input',
                question: 'Enter the amount of units to order',
                validate: function(value) {
                    if (isNaN(value) === false && parseFloat(value) > 0) {
                        return true;
                    }
                    return false;
                },
                name: 'quantity'
            }
        ])
        .then(function(ans) {
            console.log(ans.order);
            var orderItem;
            var quantity = parseFloat(ans.quantity);
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === ans.order) {
                    orderItem = res[i];
                    quantity += res[i].stock_quantity;
                }
            }
            orderInventory(orderItem, quantity);
        });
    });   
}

function orderInventory(orderItem, quantity) {
    connection.query(
        'UPDATE products SET ? WHERE ?',
        [
            {
                stock_quantity: quantity
            },
            {
                id: orderItem.id
            }
        ], function (err, res) {
            if (err) throw err;
            console.log(orderItem.product_name + ' inventory updated to ' + quantity);
            setTimeout(promptUser, 1000);
        }

        );
}

function newProduct() {
    console.clear();
    inquirer 
        .prompt([
            {
                type: 'input',
                message: 'Enter product name',
                validate: function(value) {
                    if (isNaN(value)) {
                        return true;
                    }
                    return false;
                },
                name: 'newName'
            },
            {
                type: 'input',
                message: 'Enter product department',
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
                message: 'Enter product price',
                validate: function(value) {
                    if (isNaN(value) === false && parseFloat(value) > 0) {
                        return true;
                    }
                    return false;
                },
                name: 'price'
            },
            {
                type: 'input',
                message: 'Enter order quantity',
                validate: function(value) {
                    if (isNaN(value) === false && parseFloat(value) > 0) {
                        return true;
                    }
                    return false;
                },
                name: 'quantity'
            }
        ])
        .then(function(ans) {
            var price = ans.price;
            connection.query(
                'INSERT INTO products SET ?',
                {
                    product_name: ans.newName,
                    department_name: ans.newDept,
                    price: price,
                    stock_quantity: ans.quantity,
                    product_sales: 0
                }, function(err, res) {
                    if (err) throw err;
                    console.log(ans.newName + ' added to inventory\n');
                    setTimeout(promptUser, 1000);
                }
            )
        });
}

console.clear();
promptUser();