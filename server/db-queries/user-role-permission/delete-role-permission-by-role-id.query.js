// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 */
 async function deleteRolePermissionByRoleId(id) {
    try {
        let result = null;

        const query = `UPDATE role_permission SET status = ? WHERE role_id = ? AND status = ?`;
        
        const values = [ STATUS.DELETED, id, STATUS.ACTIVE ];

		// Use normal query database process
		result = await pool.query(query, values);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteRolePermissionByRoleId };