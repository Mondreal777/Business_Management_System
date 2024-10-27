// Database
const pool = require('../../util/database/pool');
const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 * 
 */
 async function updatePurchaseRequestItemsStatus(params) {
    try {
        let result = null;
        let query = '';
        let values = '';
        const { status, purchase_request_items_id } = params;
        query = `UPDATE purchase_request_items SET status = ? WHERE purchase_request_items_id = ?`;
            values = [status, purchase_request_items_id];
        
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updatePurchaseRequestItemsStatus };