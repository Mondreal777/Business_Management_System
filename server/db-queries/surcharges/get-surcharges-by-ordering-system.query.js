// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')

/**
 * 
 * @param {Object} params
 */
async function getSurchargesByOrderingSystem(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery, ordering_system, status} = params;
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
        WHERE s.ordering_system = ? AND s.status = ?`;

        query += whereClause;
        query += orderByScript;
        query += limitQuery;

		// Use normal query database process
		result = await pool.query(query, [ ordering_system, status, values ]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * 
 * @param {Object} params
 */
async function getSurchargesByOrderingSystemCount(params) {
    try {
        let result = null;
        const { whereClause, queryValues: values, status  } = params;
        let query = `
            SELECT COUNT(*) as count
			FROM surcharges s
            LEFT JOIN surcharges_type sst ON sst.surcharges_type_id = s.surcharges_type_id
            LEFT JOIN deduction_type det ON det.deduction_type_id = s.deduction_type_id
            WHERE s.status = ?`;

        query += whereClause;

		// Use normal query dabatase process
		result = await pool.query(query, [status, values]);
        const count = result[0].count;

        return { count };
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = { getSurchargesByOrderingSystem, getSurchargesByOrderingSystemCount }