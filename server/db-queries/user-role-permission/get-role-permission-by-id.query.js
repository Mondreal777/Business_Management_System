// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getRolePermissionById(roleId) {
    try {
        let result = null;
        let query = `
			SELECT r.*, GROUP_CONCAT(p.permission) as permission, GROUP_CONCAT(p.permission_id) as permission_ids
			FROM role r
			LEFT JOIN role_permission rp ON rp.role_id = r.role_id
			LEFT JOIN permissions p ON p.permission_id = rp.permission_id
			WHERE r. status = ? AND p.status = ? AND rp.status = ?
			AND r.role_id = ?
			GROUP BY r.role_id`;
		// Use normal query database process
		result = await pool.query(query, [STATUS.ACTIVE, STATUS.ACTIVE, STATUS.ACTIVE, roleId]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getRolePermissionById };