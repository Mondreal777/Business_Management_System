// Database
const pool = require('../../util/database/pool');

const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateInventoryDetails(params, status = STATUS.ACTIVE, on_products = 'NO') {
    try {
        let result = null;

        const { productId, productNo, productName, categoryId, expiryDate, organizationId  } = params;
        const query = `UPDATE products SET product_no = ?, product_name = ?, category_id = ?, expiry_date = ?, status = ?, organization_id = ?, on_products = ? WHERE product_id = ?`;
        
        const values = [ productNo, productName, categoryId, expiryDate, status, organizationId, on_products, productId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateInventoryDetails };