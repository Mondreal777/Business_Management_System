// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateSurcharges(params) {
    try {
        let result = null;

        let { surchargesId, surchargesName, surchargesTypeId, deduction, deductionTypeId, orderingSystem, expiryDate, status } = params;
        const query = `UPDATE surcharges SET surcharges_name = ?, surcharges_type_id = ?, deduction = ?, 
        deduction_type_id = ?, ordering_system = ?, expiry_date = ?, status = ? WHERE surcharges_id = ?`;

        status = status ? status : STATUS.ACTIVE;
        const values = [ surchargesName, surchargesTypeId, deduction, deductionTypeId, orderingSystem, expiryDate, status, surchargesId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateSurcharges };