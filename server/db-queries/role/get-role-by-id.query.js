// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
async function getRoleById(id) {
    try {
        let result = null;
        let query = `
            SELECT role_id, 
                role, 
                role_type,
                description,
                organization_id,
                status, 
                created_date, 
                modified_date
            FROM role r
            WHERE r.status = ? AND r.role_id = ?`;

        let values = [STATUS.ACTIVE, id]
        // Use normal query database process
        result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getRoleById }