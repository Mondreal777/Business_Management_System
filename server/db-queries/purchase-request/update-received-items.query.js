// Database
const pool = require('../../util/database/pool');
const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 * 
 */
 async function updateReceivedItemsStatus(params) {
    try {
        let result = null;
        let query = '';
        let values = '';
        const { received_quantity, received_unit_of_measurement, received_unit_price, purchase_request_items_id} = params;
        
        query = `UPDATE purchase_request_items SET received_quantity = ?, received_unit_of_measurement = ?, received_unit_price = ? WHERE purchase_request_items_id = ?`;
        console.log(query);
        values = [received_quantity, received_unit_of_measurement, received_unit_price, purchase_request_items_id];
        
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateReceivedItemsStatus };