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
                    question: 'Which product would you like to order of?',
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
                    
                }
            ])
            .then(function(ans) {
                console.log(ans.order);
                var orderItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === ans.order) {
                        orderItem = res[i];
                    }
                }
                orderInventory(orderItem);
            });
    });   
}

function orderInventory(product) {
    connection.query('')
}


promptUser();