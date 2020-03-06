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
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.table(res);
        var exit = res.length + 1;
        console.log(exit + ') Exit program\n');
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Enter ID of item you would like to purhcase',
                    validate: function(value) {
                        if (isNaN(value) === false && parseFloat(value) > 0 && parseFloat(value) <= exit) {
                            if (parseFloat(value) === exit) {
                            connection.end();
                            process.exit();
                            }
                            return true;
                        }
                        
                        return false;
                    },
                    name: 'item'
                },
                {
                    type: 'input',
                    message: 'Enter amount of units you would like to purchase',
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
                var productID = parseFloat(ans.item);
                var quantity = parseFloat(ans.quantity);
                var orderItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].id === productID) {
                        orderItem = res[i];
                    }
                }
                if (quantity <= orderItem.stock_quantity) {
                    var stockQuantity = orderItem.stock_quantity - quantity;
                    connection.query(
                        'UPDATE products SET ? WHERE ?',
                        [
                            {
                                stock_quantity: stockQuantity
                            },
                            {
                                id: productID
                            }
                        ],
                        function(err) {
                            if (err) throw err;
                            console.clear();
                            console.log('\nOrder submitted for ' + orderItem.product_name + '.\nQuantity ordered: ' + quantity + '.\nOrder Total: ' + (orderItem.price * quantity) + '\n');
                            setTimeout(promptUser, 1000);
                        }
                    )
                }
                else {
                    console.clear();
                    console.log('\nNot enough in stock\nProduct: ' + orderItem.product_name + '\nQuantity available: ' + orderItem.stock_quantity + '\n');
                    setTimeout(promptUser, 1000);
                }
                //connection.end();
            })
    });
}

console.clear();
promptUser();


