// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveRegisteredUser(params, status) {
    try {
        let result = null;
        const { username, encryptedPass } = params;
        const query = `INSERT INTO user (username, password, status)
        VALUES (?, ?, ?)`;
        const values = [ username, encryptedPass, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
		const userId = result.insertId;

        return userId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveRegisteredUser };