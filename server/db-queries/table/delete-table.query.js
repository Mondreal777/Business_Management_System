// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {Object} params
 */
 async function deleteTableById(id) {
    try {
        let result = null;

        const query = `UPDATE tables t SET t.status = ? WHERE t.id = ?`;
        
        const values = [ STATUS.DELETED, id ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        console.log("result ::> ", result)
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteTableById };