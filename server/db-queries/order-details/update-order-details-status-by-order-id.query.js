// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {Object} params
 */
 async function updateOrderDetailsStatusByOrderId(params) {
    try {
        let result = null;
        const { status, productId, transactionId } = params;
        
        const query = `UPDATE transaction_items ti SET ti.status = ? WHERE ti.product_id = ? AND ti.transaction_id = ? AND ti.status = ?`;
        
        const values = [ status, productId, transactionId, STATUS.ACTIVE ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        console.log("result ::> ", result)
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateOrderDetailsStatusByOrderId };