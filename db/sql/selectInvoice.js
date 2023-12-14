// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

module.exports = async (query, selectedMachineId, selectedCustomerId) => {
  const sql = `SELECT
    ps.customer_id,
    c.customer_name,
    c.email,
    vm.machine_id,
    vm.machine_location,
    vm.machine_type,
    pi.product_id,
    pi.product_name,
    ps.quantity,
    ps.total_price,
    pm.payment_type,
    ps.transaction_timestamp
FROM
    product_sales ps
JOIN
    customers c ON ps.customer_id = c.customer_id
JOIN
    vending_machines vm ON ps.machine_id = vm.machine_id
JOIN
    product_inventory pi ON ps.product_id = pi.product_id
JOIN
    payment_modes pm ON ps.payment_mode_id = pm.payment_mode_id
WHERE
    ps.customer_id = ${selectedCustomerId}
    AND ps.machine_id = ${selectedMachineId};
      `;
  const results = await query(sql);
  return results;
};
