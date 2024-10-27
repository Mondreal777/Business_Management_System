// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function deletePurchaseRequestById(purchaseRequestId) {
    try {
        let result = null;

        const query = `UPDATE purchase_request SET status = ? WHERE purchase_request_id = ?`;
        
        const values = [ "Deleted", purchaseRequestId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        console.log("result ::> ", result)
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deletePurchaseRequestById };