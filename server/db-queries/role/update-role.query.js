// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateRole(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { role, roleType, description, organizationId, roleId } = params;
        const query = `UPDATE role SET role = ?, role_type = ?, description = ?, organization_id = ?, 
        status = ? WHERE role_id = ?`;
        
        const values = [ role, roleType, description, organizationId, status, roleId ];

		// Use normal query database process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateRole };