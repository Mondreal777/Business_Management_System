// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
 async function getInventoryStocks(product_id) {
    try {
        let result = null;
        let query = `
            SELECT *
			FROM stocks s
            WHERE s.product_id = ? AND s.status = ?`;

            let values = [product_id, STATUS.ACTIVE ]
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getInventoryStocks }