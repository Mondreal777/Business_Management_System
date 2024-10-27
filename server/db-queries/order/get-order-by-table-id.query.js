// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')

/**
 * 
 * @param {Object} params
 */
 async function getOrderByTableId(id) {
    try {
        
		let result = null;
        let query = `SELECT * from transaction t where t.table_id = ? and t.status = ? `;

        let values = [id, STATUS.ACTIVE];
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getOrderByTableId }