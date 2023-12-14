// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

const util = require("util");
const connection = require("../db/connection");
const fs = require("fs");
const generatePDF = require("../pdf/product");
const selectProductList = require("../db/sql/selectProductList");
const selectCustomer = require("../db/sql/selectCustomer");
const selectVendingMachine = require("../db/sql/selectVendingMachine");

//convert the query method to use promises
const query = util.promisify(connection.query).bind(connection);

class Products {
  static getAllProducts = async (req, res) => {
    const selectedMachineId = req.body.selectedMachine;

    try {
      if (selectedMachineId) {
        const results = await selectProductList(query, selectedMachineId);
        const customerList = await selectCustomer(query);

        console.log(results);
        res.render("products", { data: results, customerList });
      } else {
        const results = await selectVendingMachine(query);
        return res.render("index", {
          errorMsg: "Please select a machine to proceed",
          data: results,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  static getProductsList = async (req, res) => {
    const selectedMachineId = req.params.selectedMachine;

    try {
      const results = await selectProductList(query, selectedMachineId);

      console.log(results);
      res.render("reportProducts", { data: results });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  static getProductsPDF = async (req, res) => {
    const selectedMachineId = req.params.selectedMachine;

    try {
      const results = await selectProductList(query, selectedMachineId);

      const pdf = await generatePDF(results);
      // Pipe the PDF content to a writable stream
      const stream = pdf.pipe(fs.createWriteStream("product_list.pdf"));

      // Finalize the PDF
      pdf.end();

      // Wait for the stream to finish writing
      stream.on("finish", () => {
        // Trigger download by sending the PDF file as a response
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=product_list.pdf"
        );
        res.setHeader("Content-Type", "application/pdf");
        fs.createReadStream("product_list.pdf").pipe(res);
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  static deleteProductList = async (req, res) => {
    const productId = req.params.productId;
    const machineId = req.params.machineId;

    // SQL DELETE statement
    const deleteSql = `DELETE FROM machine_product WHERE product_id = ${productId} AND machine_id = ${machineId};`;

    try {
      // Execute the SQL statement
      const results = await query(deleteSql);

      console.log(results);
      // Send a JSON response indicating success
      res.json({ message: "Record deleted successfully" });
    } catch (error) {
      console.error("Error:", error);
      // Send a JSON response indicating an error
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static editProduct = async (req, res) => {
    const { machineId, productId, productName, category } = req.body;
    const sql = `SELECT * FROM machine_product WHERE machine_id = ${machineId} AND product_id = ${productId};`;

    try {
      //execute the sql statement
      const results = await query(sql);

      console.log(results, machineId, productId);
      const {
        quantity,
        mfg_date: mfgDate,
        expiry_date: expiryDate,
      } = results[0];

      res.render("editProduct", {
        machineId,
        productId,
        productName,
        category,
        quantity,
        mfgDate: new Date(mfgDate),
        expiryDate: new Date(expiryDate),
      });
    } catch (error) {
      console.error("Error:", error);
      // Send a JSON response indicating an error
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static editIndividualProduct = async (req, res) => {
    const {
      machineId,
      productId,
      productName,
      category,
      quantity,
      mfgDate,
      expiryDate,
    } = req.body;

    //SQL UPDATE STATEMENT
    const sql = `UPDATE machine_product SET quantity = ${quantity} WHERE machine_id = ${machineId} AND product_id = ${productId};`;

    try {
      //execute the sql statement
      const results = await query(sql);

      console.log(results);

      res.redirect(`/products-report/${machineId}`);
    } catch (error) {
      console.error("Error:", error);
      // Send a JSON response indicating an error
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = Products;
