// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function getUserRoleByUserId(user_id) {
    try {
        let result = null;

        const query = `SELECT * FROM user_role ur
        WHERE ur.user_id = ? AND ur.status = ? `;
        
        const values = [ user_id, STATUS.ACTIVE ];

		// Use normal query database process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getUserRoleByUserId };