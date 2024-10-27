// Database
const pool = require('../../util/database/pool');
const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
 async function getPurchaseRequestById(id) {
    try {
        let result = null;
        let query = `SELECT p.*, u.username from purchase_request p left join user u on p.approve_by = u.user_id where p.status <> ? and p.purchase_request_id = ?`;

        let values = [PURCHASE_REQUEST_STATUS.DELETED, id];
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPurchaseRequestById }