// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

module.exports = async (query) => {
  const sql = `SELECT * FROM customers`;

  const results = await query(sql);
  return results;
};
