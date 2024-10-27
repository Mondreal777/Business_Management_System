// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveUserRole(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { userId, roleId, organizationId } = params;
        const query = `INSERT INTO user_role (user_id, role_id, organization_id, status)
        VALUES (?, ?, ?, ?)`;
        
        const values = [ userId, roleId, organizationId, status ];

		// Use normal query database process
		result = await pool.query(query, values);
        const userRoleId = result.insertId; 

        return userRoleId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveUserRole };