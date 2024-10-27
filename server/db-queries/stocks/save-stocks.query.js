// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveInventoryStocks(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { productId, quantity, threshold  } = params;
        const query = `INSERT INTO stocks (product_id, quantity, threshold, status)
        VALUES (?, ?, ?, ?)`;
        
        const values = [ productId, quantity, threshold, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const inventoryId = result.insertId;

        return inventoryId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveInventoryStocks };