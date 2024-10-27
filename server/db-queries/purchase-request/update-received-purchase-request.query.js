// Database
const pool = require('../../util/database/pool');
const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 * 
 */
 async function updateReceivedPurchaseRequest(purchaseRequestId, referenceNo) {
    try {
        let result = null;
        let query = '';
        let values = '';
        
        query = `UPDATE purchase_request SET received = ? WHERE reference_no = ? and purchase_request_id = ?`;
        values = [1, referenceNo, purchaseRequestId];
        
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateReceivedPurchaseRequest };