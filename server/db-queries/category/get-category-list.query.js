// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getCategoryList(status = STATUS.ACTIVE) {
    try {
        let result = null;
        let query = `
            SELECT * FROM category c
            WHERE c.status = ?`;
		// Use normal query dabatase process
		result = await pool.query(query, status);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getCategoryList };