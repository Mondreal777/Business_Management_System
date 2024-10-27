// Database
const pool = require('../../util/database/pool');

const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveInventoryDetails(params, status = STATUS.ACTIVE, on_products = 'NO') {
    try {
        let result = null;

        const { productNo, productName, categoryId, expiryDate, organizationId  } = params;
        const query = `INSERT INTO products (product_no, product_name, category_id, expiry_date, status, organization_id, on_products)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [ productNo, productName, categoryId, expiryDate, status, organizationId, on_products ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const inventoryId = result.insertId;

        return inventoryId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveInventoryDetails };