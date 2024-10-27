// Database
const pool = require('../../util/database/pool');
 
async function getPurchaseRequestItemsByPurchaseRequestId(purchaseRequestId) {
    try {
        let result = null;
        let query = `SELECT * from purchase_request_items where purchase_request_id = ?`;

        let values = [purchaseRequestId];
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPurchaseRequestItemsByPurchaseRequestId }