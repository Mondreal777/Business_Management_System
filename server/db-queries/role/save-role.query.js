// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveRole(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { role, roleType, description, organizationId } = params;
        const query = `INSERT INTO role (role, role_type, description, organization_id, status)
        VALUES (?, ?, ?, ?, ?)`;
        
        const values = [ role, roleType, description, organizationId, status ];

		// Use normal query database process
		result = await pool.query(query, values);
        const roleId = result.insertId; 

        return roleId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveRole };