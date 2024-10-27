// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {Object} params
 */
 async function updateOrderStatusById(id, status = STATUS.DONE) {
    try {
        let result = null;

        const query = `UPDATE transaction t SET t.status = ? WHERE t.transaction_id = ?`;
        
        const values = [ status, id ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        console.log("result ::> ", result)
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateOrderStatusById };