// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getRoleList(status = STATUS.ACTIVE) {
    try {
        let result = null;
        let query = `
            SELECT * FROM role r
            WHERE r.status = ?`;
		// Use normal query database process
		result = await pool.query(query, status);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getRoleList };