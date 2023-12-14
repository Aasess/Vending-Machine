// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

const util = require("util");
const connection = require("../db/connection");
const selectVendingMachine = require("../db/sql/selectVendingMachine");

//convert the query method to use promises
const query = util.promisify(connection.query).bind(connection);

class VendingMachines {
  static getAllMachines = async (req, res) => {
    try {
      const results = await selectVendingMachine(query);

      console.log(results);
      res.render("index", { data: results, errorMsg: null });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };
}

module.exports = VendingMachines;
