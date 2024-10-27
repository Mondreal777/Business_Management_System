// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateDiscount(params) {
    try {
        let result = null;

        let { discountId, discountName, discountTypeId, deduction, deductionTypeId, orderingSystem, expiryDate, status } = params;
        const query = `UPDATE discount SET discount_name = ?, discount_type_id = ?, deduction = ?, 
        deduction_type_id = ?, ordering_system= ?, expiry_date = ?, status = ? WHERE discount_id = ?`;
        
		status = status ? status : STATUS.ACTIVE;

        const values = [ discountName, discountTypeId, deduction, deductionTypeId, orderingSystem, expiryDate, status, discountId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateDiscount };