// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

//DATABASE
const connection = require("./db/connection");

//CONTROLLERS
const controllers = require("./controllers");

//create new express application
const app = new express();

//connect to database
connection.connect((err) => {
  if (err) {
    return console.log("error:", err.message);
  }
  console.log("Connected to the MYSQL server");
});

// serve static files from public folder
app.use(express.static("public"));

//add `body-parser` to middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//use ejs as templating engine
app.set("view engine", "ejs");

//ROUTES
app.get("/", controllers.VendingMachines.getAllMachines);

//POST method to handle selection of vending machine
app.post("/vending-machine", controllers.Products.getAllProducts);

//GET method to view all the product list
app.get(
  "/products-report/:selectedMachine",
  controllers.Products.getProductsList
);

app.get("/generate-pdf/:selectedMachine", controllers.Products.getProductsPDF);

app.get("/confirm-order", controllers.UserOrder.getConfirmOrder);
app.post("/confirm-order", controllers.UserOrder.saveUserOrder);

app.post("/generate-invoice", controllers.UserOrder.getUserInvoice);

app.delete(
  "/delete-product/:machineId/:productId",
  controllers.Products.deleteProductList
);

app.post("/edit-btn", controllers.Products.editProduct);

app.post("/edit-product", controllers.Products.editIndividualProduct);

app.listen(5000, () => {
  console.log("Server running at port 5000");
});
