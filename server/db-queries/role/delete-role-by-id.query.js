// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 */
 async function deleteRoleById(id) {
    try {
        let result = null;

        const query = `UPDATE role r SET r.status = "?" WHERE r.role_id = ?`;
        
        const values = [ STATUS.DELETED, id ];

		// Use normal query database process
		result = await pool.query(query, values);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteRoleById };