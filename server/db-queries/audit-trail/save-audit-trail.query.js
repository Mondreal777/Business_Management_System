// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveAuditTrail(params) {
    try {
        let result = null;

        const { userId, module, action, data, oldData } = params;
        const query = `INSERT INTO user_logs (user_id, module, action, data, old_data)
        VALUES (?, ?, ?, ?, ?)`;
        
        const values = [ userId, module, action, data, oldData ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const auditTrailId = result.insertId;

        return auditTrailId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveAuditTrail };