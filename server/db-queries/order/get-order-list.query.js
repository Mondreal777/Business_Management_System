// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')

/**
 * 
 * @param {Object} params
 */
 async function getOrderList(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery, status } = params;
		let result = null;
        let query = `SELECT t.*, 
        COUNT(ti.quantity) as item_quantity, 
        tb.table_no, 
        pm.payment_method 
        FROM transaction t 
        JOIN transaction_items ti ON t.transaction_id = ti.transaction_id
        LEFT JOIN tables tb ON tb.id = t.table_id
        LEFT JOIN payment_method pm ON pm.payment_method_id = t.payment_method_id
        WHERE t.status = ? AND ti.status = ? 
        GROUP BY t.transaction_id`;

		query += whereClause;
        query += orderByScript;
        query += limitQuery;

		// Use normal query dabatase process
		result = await pool.query(query, [status, status, values]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function getOrderListCount(params) {
    try {
        
		let result = null;
        const { whereClause, queryValues: values, status  } = params;
        let query = `SELECT COUNT(*) as count
		FROM transaction t 
		LEFT JOIN tables tb ON tb.id = t.table_id
		WHERE t.status = ? `;

        query += whereClause;
		// Use normal query dabatase process
		result = await pool.query(query, [status, values]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = { getOrderList, getOrderListCount }