// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {String} username
 * @param {String} status
 */
 async function getuserByUsername(username, status) {
    try {
        let result = null;
        
        const query = `SELECT * FROM user
        WHERE username LIKE ? AND
        status = ?`;
        const values = [ username, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getuserByUsername };