// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateUserFullName(params, status) {
    try {
        let result = null;
        console.log(params)
        const { lastName, firstName, userId } = params;
        const query = `UPDATE user_details SET last_name = ?, first_name = ?
        WHERE user_details.user_id = ? AND user_details.status = ?`;
        
        const values = [ lastName, firstName, userId, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateUserFullName };