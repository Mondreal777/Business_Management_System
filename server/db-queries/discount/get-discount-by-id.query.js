// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
async function getDiscountById(id) {
    try {
        let result = null;
        let query = `
            SELECT d.discount_id, 
                d.discount_name, 
                dst.discount_type, 
                d.deduction_type_id, 
                d.deduction, 
                det.deduction_type, 
                d.expiry_date,
                d.ordering_system,
                d.status
            FROM discount d
            LEFT JOIN discount_type dst ON dst.discount_type_id = d.discount_type_id
            LEFT JOIN deduction_type det ON det.deduction_type_id = d.deduction_type_id
            WHERE d.status <> ? AND d.discount_id = ?`;

        let values = [STATUS.DELETED, id]
        // Use normal query dabatase process
        result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getDiscountById }