// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')

/**
 * 
 * @param {Object} params
 */
 async function getTableByTableNo(tableNo) {
    try {
        
		let result = null;
        let query = `SELECT * from tables t WHERE t.table_no = ? AND t.status = ?`;

		// Use normal query dabatase process
		result = await pool.query(query, [tableNo, STATUS.ACTIVE]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getTableByTableNo }