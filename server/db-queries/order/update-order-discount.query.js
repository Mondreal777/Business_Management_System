// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateOrderDiscount(params, status = STATUS.ACTIVE, serviceCharge) {
    try {
        let result = null;
        const { total_price, discount, discount_value, id } = params;
        var new_total_price = total_price;
        
        if( serviceCharge ) {
            new_total_price = parseInt(new_total_price) + parseInt(serviceCharge)  
        }
        const query = `UPDATE transaction t SET total_price = ?, discount= ?, discount_value = ?
        WHERE t.transaction_id = ? and status = ?`;
        
        const values = [new_total_price, discount, discount_value, id, status];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateRequestedOrderDiscount(params, status = STATUS.ACTIVE) {
    try {
        let result = null;
        const { applied_discount_value, id } = params;
        
        const query = `UPDATE transaction t SET applied_discount_value = ?
        WHERE t.transaction_id = ? and status = ?`;
        
        const values = [applied_discount_value, id, status];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = { updateOrderDiscount, updateRequestedOrderDiscount };