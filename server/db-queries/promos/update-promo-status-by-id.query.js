// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updatePromoStatusById(params) {
    try {
        let result = null;

        const { status, id } = params;
        const query = `UPDATE promos SET status = ? WHERE id = ?`;
        
        const values = [status, id];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updatePromoStatusById };