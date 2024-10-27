// Database
const pool = require('../../util/database/pool');
const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 * 
 */
 async function updateStatusPurchaseRequest(params, userId, userRoleId) {
    try {
        let result = null;
        let query = '';
        let values = '';
        const { status, referenceNo, purchaseRequestId, reasonForRejection} = params;
        
        if(status == PURCHASE_REQUEST_STATUS.APPROVE){
            query = `UPDATE purchase_request SET status = ?, approve_by = ? WHERE reference_no = ? and purchase_request_id = ?`;
            values = [status, userId, referenceNo, purchaseRequestId];
        } else if(status == PURCHASE_REQUEST_STATUS.REJECT){
            query = `UPDATE purchase_request SET status = ?, reason_for_rejection = ? WHERE reference_no = ? and purchase_request_id = ?`;
            values = [status, reasonForRejection, referenceNo, purchaseRequestId];
        } else {
            query = `UPDATE purchase_request SET status = ? WHERE reference_no = ? and purchase_request_id = ?`;
            values = [status, referenceNo, purchaseRequestId];
        }
        
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateStatusPurchaseRequest };