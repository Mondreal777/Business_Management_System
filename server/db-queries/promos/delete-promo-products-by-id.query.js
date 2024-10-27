// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {Object} params
 */
 async function deletePromoProductsById(id) {
    try {
        let result = null;

        const query = `delete from promo_products WHERE promo_id = ?`;
        
        const values = [ id ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deletePromoProductsById };