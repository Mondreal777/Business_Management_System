// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getPromosById(id) {
    try {
        let result = null;
        let query = `SELECT * from promos where id = ?`;

        let values = [id];
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPromosById }