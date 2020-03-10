const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
let productsArr;
let productsObj;
let totalSales;
let salePrice;
let orderItem;
let stockQuantity;
let productID;
let quantity;

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
        productsArr = [];
        for (var i = 0; i < res.length; i++) {
            productsObj = {ID: res[i].id, Name: res[i].product_name, Price: res[i].price, Quantity: res[i].stock_quantity};
            productsArr.push(productsObj);
        }
        console.table(productsArr);
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
                productID = parseFloat(ans.item);
                quantity = parseFloat(ans.quantity);
                for (var i = 0; i < res.length; i++) {
                    if (res[i].id === productID) {
                        orderItem = res[i];
                    }
                }
                totalSales = orderItem.product_sales;
                salePrice = orderItem.price * quantity;
                totalSales += salePrice;
                if (quantity <= orderItem.stock_quantity) {
                    stockQuantity = orderItem.stock_quantity - quantity;
                    connection.query(
                        'UPDATE products SET ?,? WHERE ?',
                        [
                            {
                                stock_quantity: stockQuantity
                            }, 
                            {
                                product_sales: totalSales
                            },
                            {
                                id: productID
                            }
                        ],
                        function(err) {
                            if (err) throw err;
                            console.clear();
                            console.log('\nOrder submitted for ' + orderItem.product_name + '.\nQuantity ordered: ' + quantity + '.\nOrder Total: ' + (orderItem.price * quantity).toFixed(2) + '\n');
                            setTimeout(promptUser, 1000);
                        }
                    )
                }
                else {
                    console.clear();
                    console.log('\nNot enough in stock\nProduct: ' + orderItem.product_name + '\nQuantity available: ' + orderItem.stock_quantity + '\n');
                    setTimeout(promptUser, 1000);
                }
            })
    });
}

console.clear();
promptUser();


