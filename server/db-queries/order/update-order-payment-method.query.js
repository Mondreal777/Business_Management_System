// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateOrderPaymentMethod(params, status = STATUS.ACTIVE,) {
    try {
        let result = null;

        const { payment_method_id, totalPrice, tipValue, feedback, id } = params;

        const query = `UPDATE transaction t 
        SET t.payment_method_id = ?, t.total_price = ?, t.tip = ?, t.feedback = ? 
        WHERE t.transaction_id = ? AND t.status = ?`;
        
        const values = [ payment_method_id, totalPrice, tipValue, feedback, id, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateOrderPaymentMethod };