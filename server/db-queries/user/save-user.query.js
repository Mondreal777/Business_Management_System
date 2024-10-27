// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveUser(params, status) {
    try {
        let result = null;
        console.log(params)
        const { username, encryptedPass , external_id, userId, changedPass } = params;
        const query = `UPDATE user SET external_id = ?, username = ?, password = ?, changed_pass = ?, status = ? WHERE user_id = ?`;
        
        const values = [ external_id, username, encryptedPass, changedPass, status, userId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveUser };