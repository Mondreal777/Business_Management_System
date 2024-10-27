// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function deleteInventoryStocks(productId) {
    try {
        let result = null;

        const query = `UPDATE stocks SET status = ? WHERE product_id = ?`;
        
        const values = [ STATUS.DELETED, productId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteInventoryStocks };