// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updatePromosById(params) {
    try {
        let result = null;

        const { name, product, description, price, duration, time, orderLimit, status, id } = params;
        const query = `UPDATE promos SET name = ?, product_id= ?, description = ?, price = ?, duration = ?, time= ?,
                       order_limit = ?, status = ? WHERE id = ?`;
        
        const values = [name, product, description, price, duration, time, orderLimit, status, id];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updatePromosById };