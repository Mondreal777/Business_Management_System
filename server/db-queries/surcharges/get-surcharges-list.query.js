// Database
const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getSurchargesList(params) {
    try {
        let result = null;
        const { whereClause, orderByScript, queryValues: values , limitQuery } = params;
        let query = `
            SELECT s.*,
                sst.surcharges_type,
                det.deduction_type
            FROM surcharges s
            LEFT JOIN surcharges_type sst ON sst.surcharges_type_id = s.surcharges_type_id
            LEFT JOIN deduction_type det ON det.deduction_type_id = s.deduction_type_id
            WHERE s.status <> ?`;

        query += whereClause;
        query += orderByScript;
        query += limitQuery;

		// Use normal query dabatase process
		result = await pool.query(query, [STATUS.DELETED, values]);

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
 async function getSurchargesListCount(params) {
    try {
        let result = null;
        const { whereClause, queryValues: values  } = params;
        let query = `
            SELECT COUNT(*) as count
			FROM surcharges s
            LEFT JOIN surcharges_type sst ON sst.surcharges_type_id = s.surcharges_type_id
            LEFT JOIN deduction_type det ON det.deduction_type_id = s.deduction_type_id
            WHERE s.status = ?`;

        query += whereClause;

		// Use normal query dabatase process
		result = await pool.query(query, [values, STATUS.ACTIVE, STATUS.ACTIVE]);
        const count = result[0].count;

        return { count };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getSurchargesList, getSurchargesListCount };