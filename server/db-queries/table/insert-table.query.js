// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveTable(params) {
    try {
        let result = null;

        const { tableNo, qrCode, url, capacity, occupancy, tableName } = params;
        const query = `INSERT INTO tables (table_no, qr_code, url, capacity, occupancy, table_name, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [tableNo, qrCode, url, capacity, occupancy, tableName, STATUS.ACTIVE];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const tableId = result.insertId;

        return tableId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveTable };