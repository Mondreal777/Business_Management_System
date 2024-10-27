// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateOrderPaymentDetails(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { payment_card_number, cash_tendered, card_amount_received, customer_name, customer_contact_number, id } = params;

        const query = `UPDATE transaction t 
        SET t.payment_card_number = ?,
        t.cash_tendered = ?,
        t.card_amount_received = ?,
        t.customer_name = ?,
        t.customer_contact_number = ? 
        WHERE t.transaction_id = ? AND t.status = ?`;
        
        const values = [ payment_card_number, cash_tendered, card_amount_received, customer_name, customer_contact_number, id, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateOrderPaymentDetails };