// Database
const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getDiscountList(params) {
    try {
        let result = null;
        const { whereClause, orderByScript, queryValues: values , limitQuery } = params;
        let query = `
            SELECT d.discount_id, 
                d.discount_name, 
                dst.discount_type, 
                d.deduction, 
				d.deduction_type_id,
				d.discount_type_id,
                det.deduction_type, 
                d.expiry_date,
                d.ordering_system,
                d.status,
                (CASE
                    WHEN d.ordering_system = 1 THEN 'Dine In'
                    ELSE 'TAKEOUT'
                END) as ordering_system_name
            FROM discount d
            LEFT JOIN discount_type dst ON dst.discount_type_id = d.discount_type_id
            LEFT JOIN deduction_type det ON det.deduction_type_id = d.deduction_type_id
            WHERE d.status <> ?`;

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
 async function getDiscountListCount(params) {
    try {
        let result = null;
        const { whereClause, queryValues: values  } = params;
        let query = `
            SELECT COUNT(*) as count
			FROM discount d
            LEFT JOIN discount_type dst ON dst.discount_type_id = d.discount_type_id
            LEFT JOIN deduction_type det ON det.deduction_type_id = d.deduction_type_id
            WHERE d.status <> ?`;

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

module.exports = { getDiscountList, getDiscountListCount };