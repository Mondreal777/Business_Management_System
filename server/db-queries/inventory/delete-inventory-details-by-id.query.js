// Database
const pool = require('../../util/database/pool');

const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function deleteInventorydetailsById(inventoryId) {
    try {
        let result = null;

        const query = `UPDATE products SET status = ?, on_products = ? WHERE products.product_id = ?`;
        
        const values = [ STATUS.DELETED, PRODUCT_MENU_STATUS.NOT_on_products, inventoryId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        console.log("result ::> ", result)
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteInventorydetailsById };