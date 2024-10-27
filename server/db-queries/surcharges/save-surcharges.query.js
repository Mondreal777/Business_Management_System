// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveSurcharges(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { surchargesName, surchargesTypeId, deduction, deductionTypeId, orderingSystem, expiryDate } = params;
        const query = `INSERT INTO surcharges (surcharges_name, surcharges_type_id, deduction, deduction_type_id, ordering_system, expiry_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [ surchargesName, surchargesTypeId, deduction, deductionTypeId, orderingSystem, expiryDate, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const surchargesId = result.insertId;

        return surchargesId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveSurcharges };