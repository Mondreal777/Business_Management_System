// Database
const pool = require('../../util/database/pool');
const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
async function getProductDetailsById(id) {
    try {
        let result = null;
        let query = `
                    SELECT p.product_id,
                    p.product_no,
                    p.product_name,
                    pd.product_price,
                    c.name as category,
                    p.category_id,
                    p.expiry_date,
                    p.created_date,
                    p.modified_date,
                    p.status,
                    p.on_products,
                    p.organization_id,
                    s.quantity,
                    s.threshold,
                    pd.description,
                    pd.image_url,
                    pd.id
            FROM products p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN stocks s ON p.product_id = s.product_id
            LEFT JOIN product_details pd ON p.product_id = pd.product_id
            WHERE pd.id = ? AND p.status = ? AND s.status = ? AND pd.status = ? AND p.on_products = ?`;

        let values = [id, STATUS.ACTIVE, STATUS.ACTIVE, STATUS.ACTIVE, PRODUCT_MENU_STATUS.ON_PRODUCTS]
        // Use normal query dabatase process
        result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getProductDetailsById }