// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
async function getSurchargesById(id) {
    try {
        let result = null;
        let query = `
        SELECT s.surcharges_id, 
            s.surcharges_name, 
            sst.surcharges_type, 
            s.deduction, 
            s.deduction_type_id, 
            det.deduction_type, 
            s.ordering_system, 
            s.expiry_date
        FROM surcharges s
        LEFT JOIN surcharges_type sst ON sst.surcharges_type_id = s.surcharges_type_id
        LEFT JOIN deduction_type det ON det.deduction_type_id = s.deduction_type_id
        WHERE s.status <> ? AND s.surcharges_id = ?`;
        let values = [STATUS.DELETED, id]
        // Use normal query dabatase process
        result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getSurchargesById }