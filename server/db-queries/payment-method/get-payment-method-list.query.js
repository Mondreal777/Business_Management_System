// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getPaymentMethodList(status = STATUS.ACTIVE) {
    try {
        let result = null;
        let query = `
            SELECT * FROM payment_method pm
            WHERE pm.status = ?`;
		// Use normal query dabatase process
		result = await pool.query(query, status);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPaymentMethodList };