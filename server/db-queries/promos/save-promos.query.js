// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function savePromos(params) {
    try {
        let result = null;

        const { name, product, description, price, duration, time, orderLimit, createdBy, status } = params;
        const query = `INSERT INTO promos (name, product_id, description, price, duration, time, order_limit, created_by, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [ name, product, description, price, duration, time, orderLimit, createdBy, status];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const purchaseRequestId = result.insertId;

        return purchaseRequestId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { savePromos };