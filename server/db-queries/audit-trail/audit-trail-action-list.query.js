// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function auditTrailActionList() {
    try {
        let result = null;
        let query = `SELECT distinct(action)
        FROM user_logs`;
		// Use normal query database process
		result = await pool.query(query);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { auditTrailActionList };