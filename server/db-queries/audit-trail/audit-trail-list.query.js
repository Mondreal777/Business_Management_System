// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function auditTrailList() {
    try {
        let result = null;
        let query = `SELECT ul.*, u.username
        FROM user_logs ul
        LEFT JOIN user u ON u.user_id = ul.user_id `;
		// Use normal query database process
		result = await pool.query(query);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { auditTrailList };