// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

module.exports = async (query, params) => {
  let totalPrice = 0;
  let totalTax = 0;

  // First, execute the stored procedure
  const procedureSql = `CALL InsertProductSale(
    ${params.machineId},
    '${params.selectedProduct}',
    ${params.customerId},
    ${params.paymentMode},
    '${params.selectedQuantity}',
    @totalPrice,
    @totalTax
  );`;

  await query(procedureSql);

  // Second, retrieve the output parameters
  const outputSql = "SELECT @totalPrice as totalPrice, @totalTax as totalTax;";
  const results = await query(outputSql);

  // Accessing the output parameter values
  const retrievedTotalPrice = results[0].totalPrice;
  const retrievedTotalTax = results[0].totalTax;

  console.log("Retrieved Total Price:", retrievedTotalPrice);
  console.log("Retrieved Total Tax:", retrievedTotalTax);

  // You can use the retrievedTotalPrice and retrievedTotalTax as needed
  return results;
};
