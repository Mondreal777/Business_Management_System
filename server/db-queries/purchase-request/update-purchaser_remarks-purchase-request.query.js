// Database
const pool = require('../../util/database/pool');
const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 * 
 */
 async function updatePurchaserRemarksPurchaseRequest(purchaserRemarks, purchaseRequestId) {
    try {
        let result = null;
        let query = '';
        let values = '';
        query = `UPDATE purchase_request SET purchaser_remarks = ? WHERE purchase_request_id = ?`;
            values = [purchaserRemarks, purchaseRequestId];
        
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updatePurchaserRemarksPurchaseRequest };