// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function savePromoProducts(productId, promoId) {
    try {
        let result = null;

        
        const query = `INSERT INTO promo_products (product_id, promo_id)
        VALUES (?, ?)`;
        const values = [ productId, promoId ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const promoProductsId = result.insertId;

        return promoProductsId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { savePromoProducts };