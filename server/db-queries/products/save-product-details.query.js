// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveProductDetails(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { productId, price, imageURLBase64, description } = params;
        const query = `INSERT INTO product_details (product_id, product_price, image_url, description, status)
        VALUES (?, ?, ?, ?, ?)`;
        
        const values = [ productId, price, imageURLBase64, description, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const inventoryId = result.insertId;

        return inventoryId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveProductDetails };