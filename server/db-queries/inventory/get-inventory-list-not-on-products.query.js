// Database
const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getInventoryListNotOnProducts(params) {
    try {
        let result = null;
        const { whereClause, orderByScript, queryValues: values , limitQuery } = params;
        let query = `
                SELECT p.product_id,
                p.product_no,
                p.product_name,
                c.name as category,
                p.category_id,
                p.expiry_date,
                p.created_date,
                p.modified_date,
                p.status,
                p.image_url,
                p.on_products,
                p.organization_id,
                s.quantity,
                s.threshold
            FROM products p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN stocks s ON p.product_id = s.product_id
            WHERE p.status = ? AND s.status = ? AND p.on_products = ?`;

        query += whereClause;
        query += orderByScript;
        query += limitQuery;

		// Use normal query dabatase process
		result = await pool.query(query, [values, STATUS.ACTIVE, PRODUCT_MENU_STATUS.NOT_ON_PRODUCTS]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = { getInventoryListNotOnProducts };