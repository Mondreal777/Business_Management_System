// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {String} username
 * @param {String} status
 */
 async function getUserById(userId, status) {
    try {
        let result = null;
        
        const query = `SELECT * FROM user
        WHERE user_id = ? AND
        status = ?`;
        const values = [ userId, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getUserById };