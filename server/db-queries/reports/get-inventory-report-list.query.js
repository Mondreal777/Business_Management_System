// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
 async function getInventoryReportList(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery, status } = params;
		let result = null;
        let query = `
            SELECT p.product_id,
            p.product_no,
            p.product_name,
            p.on_products,
            s.quantity,
            s.threshold,
            s.created_date,
            s.modified_date
            FROM products p
            LEFT JOIN stocks s ON s.product_id = p.product_id
            WHERE s.status = ?`;

        query += whereClause;
        query += orderByScript;
        query += limitQuery;

        // Use normal query dabatase process
        result = await pool.query(query, [status, values]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getInventoryReportListCount(params) {
    try {
        
		let result = null;
        const { whereClause, queryValues: values, status  } = params;
        let query = `SELECT COUNT(*) as count
		FROM products p 
		LEFT JOIN stocks s ON s.product_id = p.product_id
		WHERE s.status = ? `;

        query += whereClause;
		// Use normal query dabatase process
		result = await pool.query(query, [status, values]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getInventoryReportList, getInventoryReportListCount };