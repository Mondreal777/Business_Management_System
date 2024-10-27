// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {Object} params
 */
 async function deletePromosById(id) {
    try {
        let result = null;

        const query = `UPDATE promos SET status = ? WHERE id = ?`;
        
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

module.exports = { deletePromosById };