// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updatePurchaseRequestById(params) {
    try {
        let result = null;

        const { requestName, requestType, requestorName, requestDate, itemName, quantity, unitOfMeasurement, unitPrice, remarks, requestBy, referenceNo, purchaseRequestId } = params;
        const query = `UPDATE purchase_request SET request_name = ?, request_type = ?, requestor_name = ?, request_date = ?, item_name= ?, quantity = ?, unit_of_measurement = ?, unit_price = ?, remarks = ?, request_by = ? WHERE reference_no = ? and purchase_request_id = ?`;
        
        const values = [ requestName, requestType, requestorName, requestDate, itemName, quantity, unitOfMeasurement, unitPrice, remarks, requestBy, referenceNo, purchaseRequestId];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updatePurchaseRequestById };