// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function deleteUserRole(user_id) {
    try {
        let result = null;

        const query = `UPDATE user_role ur SET ur.status = ? WHERE ur.user_id = ? and ur.status = ?`;
        
        const values = [ STATUS.DELETED, user_id, STATUS.ACTIVE ];

		// Use normal query database process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteUserRole };