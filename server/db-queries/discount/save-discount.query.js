// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveDiscount(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { discountName, discountTypeId, deduction, deductionTypeId, orderingSystem, expiryDate } = params;
        const query = `INSERT INTO discount (discount_name, discount_type_id, deduction, deduction_type_id, ordering_system, expiry_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [ discountName, discountTypeId, deduction, deductionTypeId, orderingSystem, expiryDate, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const discountId = result.insertId;

        return discountId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveDiscount };