// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateTableById(params) {
    try {
        let result = null;

        const { tableNo, qrCode, url, capacity, occupancy, tableStatus, id , tableName} = params;
        const query = `UPDATE tables t SET t.table_name = ?, t.table_no = ?, t.qr_code = ?, t.url = ?, t.capacity = ?, t.occupancy = ?, t.status = ? WHERE t.id = ?`;
        
        const values = [tableName, tableNo, qrCode, url, capacity, occupancy, tableStatus, id];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateTableById };