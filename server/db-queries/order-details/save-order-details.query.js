// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveOrderDetails(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { transaction_id, product_id, quantity, unit_price, total_price } = params;
        const query = `INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, total_price, status)
        VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [transaction_id, product_id, quantity, unit_price, total_price, status];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const tableId = result.insertId;

        return tableId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveOrderDetails };