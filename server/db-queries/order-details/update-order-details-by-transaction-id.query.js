// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateOrderDetails(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { quantity, unit_price, total_price, transaction_id, product_id } = params;
        const query = `UPDATE transaction_items ti 
        SET  
        quantity = ?, 
        unit_price = ?, 
        total_price = ?
        WHERE ti.transaction_id = ? AND product_id = ? AND status = ?`;
        const values = [quantity, unit_price, total_price, transaction_id, product_id, status];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const tableId = result.insertId;

        return tableId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateOrderDetails };