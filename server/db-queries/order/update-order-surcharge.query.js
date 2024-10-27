// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateOrderSurcharges(params, status = STATUS.ACTIVE, discountValue) {
    try {
        let result = null;
        
        const { items_price, service_charge, applied_service_charge, id } = params;
        var new_total_price = items_price; 
        
        const query = `UPDATE transaction t SET total_price = ?, service_charge = ?, applied_service_charge = ?
		WHERE t.transaction_id = ? and status = ?`;
        
        const values = [new_total_price, service_charge, applied_service_charge, id, status];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateOrderSurcharges };