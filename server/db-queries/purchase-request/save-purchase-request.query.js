// Database
const pool = require('../../util/database/pool');

const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function savePurchaseRequestDetails(params) {
    try {
        let result = null;

        const { requestName, requestType, requestorName, requestDate, remarks, requestBy, referenceNo } = params;
        const query = `INSERT INTO purchase_request (request_name, request_type, requestor_name, request_date, remarks, request_by, status, reference_no)
        VALUES (?, ?, ?, ?, ? ,? ,? ,?)`;
        const values = [ requestName, requestType, requestorName, requestDate, remarks, requestBy , PURCHASE_REQUEST_STATUS.PENDING, referenceNo];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const purchaseRequestId = result.insertId;

        return purchaseRequestId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { savePurchaseRequestDetails };