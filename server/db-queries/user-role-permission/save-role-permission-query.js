// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveRolePermission(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { roleId, permissionId } = params;
        const query = `INSERT INTO role_permission (role_id, permission_id, status)
        VALUES (?, ?, ?)`;
        
        const values = [ roleId, permissionId , status ];

		// Use normal query database process
		result = await pool.query(query, values);
        const rolePermissionId = result.insertId; 

        return rolePermissionId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveRolePermission };