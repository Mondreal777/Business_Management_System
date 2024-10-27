// Database
const pool = require('../../util/database/pool');

const { STATUS, PRODUCT_MENU_STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function deleteOrderDetailsById(id) {
    try {
        let result = null;

        const query = `UPDATE transaction_items SET transaction_items.status = ? WHERE transaction_items.transaction_item_id = ?`;
        
        const values = [ STATUS.DELETED, id ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { deleteOrderDetailsById };