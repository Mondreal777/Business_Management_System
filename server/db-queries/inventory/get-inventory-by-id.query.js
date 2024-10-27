// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
 async function getInventoryById(inventoryId) {
    try {
        let result = null;
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
                    s.threshold,
                    s.created_date AS stocks_created_date,
                    s.modified_date AS stocks_modified_date
			FROM products p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN stocks s ON p.product_id = s.product_id
            WHERE p.product_id = ? AND p.status = ? AND s.status = ?`;

            let values = [inventoryId, STATUS.ACTIVE, STATUS.ACTIVE ]
		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getInventoryById }