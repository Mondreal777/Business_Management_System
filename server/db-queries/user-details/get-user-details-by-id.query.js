const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getUserDetailsById(id) {
    try {
        let result = null;
        let query = `
            SELECT * FROM user_details ud WHERE ud.user_details_id = ? AND ud.status = ?`;

		// Use normal query dabatase process
		result = await pool.query(query, [id, STATUS.ACTIVE]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getUserDetailsById };