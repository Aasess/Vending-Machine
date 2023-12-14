// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

const util = require("util");
const connection = require("../db/connection");
const fs = require("fs");
const procedureProductSale = require("../db/sql/procedureProductSale");
const selectInvoice = require("../db/sql/selectInvoice");
const generateInvoice = require("../pdf/invoice");

//convert the query method to use promises
const query = util.promisify(connection.query).bind(connection);

class UserOrder {
  static saveUserOrder = async (req, res) => {
    try {
      const { machineId, selectedProduct, customerId, paymentMode } = req.body;

      if (selectedProduct || selectedProduct?.length > 0) {
        const params = {
          machineId,
          selectedProduct: Array.isArray(selectedProduct)
            ? selectedProduct.join(",")
            : selectedProduct,
          customerId,
          paymentMode,
          selectedQuantity: "1,".repeat(selectedProduct.length).slice(0, -1),
        };
        const results = await procedureProductSale(query, params);

        console.log(results, "resultsTotal", results?.[0]?.totalPrice);
        res.render("successOrder", {
          machineId,
          customerId,
          totalPrice: results?.[0]?.totalPrice,
          totalTax: results?.[0]?.totalTax,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  static getConfirmOrder = async (req, res) => {
    res.render("successOrder", {
      machineId: null,
      customerId: null,
      totalPrice: 0,
      totalTax: 0,
    });
  };

  static getUserInvoice = async (req, res) => {
    try {
      const { machineId, customerId, totalPrice, totalTax } = req.body;

      const results = await selectInvoice(query, machineId, customerId);

      console.log(
        results,
        "totals",
        totalPrice,
        totalTax,
        console.log(req.body)
      );
      const pdf = await generateInvoice(results, totalPrice, totalTax);
      // Pipe the PDF content to a writable stream
      const stream = pdf.pipe(fs.createWriteStream("invoice.pdf"));

      // Finalize the PDF
      pdf.end();

      // Wait for the stream to finish writing
      stream.on("finish", () => {
        // Trigger download by sending the PDF file as a response
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=invoice.pdf"
        );
        res.setHeader("Content-Type", "application/pdf");
        fs.createReadStream("invoice.pdf").pipe(res);
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };
}

module.exports = UserOrder;
