// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 */
 async function deleteSurchargesById(id) {
    try {
        let result = null;

        const query = `UPDATE surcharges SET surcharges.status = ? WHERE surcharges.surcharges_id = ?`;
        
        const values = [ STATUS.DELETED, id ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteSurchargesById };