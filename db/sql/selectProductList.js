// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

module.exports = async (query, selectedMachineId) => {
  const sql = `SELECT
    mp.machine_id,
    pi.product_id,
    pi.product_name,
    pi.category,
    pi.price,
    mp.quantity,
    mp.mfg_date,
    mp.expiry_date
  FROM
    machine_product mp
  JOIN
    product_inventory pi ON mp.product_id = pi.product_id
  WHERE
    mp.machine_id = ${selectedMachineId};`;
  const results = await query(sql);
  return results;
};
