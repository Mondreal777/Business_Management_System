// Database
const pool = require('../../util/database/pool');

const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateInventoryOnProducts(product_id, on_products = 'NO') {
    try {
        let result = null;
        const query = `UPDATE products SET on_products = ? WHERE product_id = ?`;
        
        const values = [ on_products, product_id ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateInventoryOnProducts };