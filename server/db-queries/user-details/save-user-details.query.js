// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveUserDetails(params, status = STATUS.ACTIVE) {
    try {
        let result = null;
        console.log(params)
        const { userId, last_name, first_name, middle_name, suffix, avatar_url, address_line_1, address_line_2, city, province, country, zip, email, contact_no  } = params;
        const query = `INSERT INTO user_details (user_id, last_name, first_name, middle_name, suffix, avatar_url, 
            address_line_1, address_line_2, city, province, country, zip, email, contact_no, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [  userId, last_name, first_name, middle_name, suffix, avatar_url, address_line_1, 
            address_line_2, city, province, country, zip, email, contact_no, status ];

		// Use normal query dabatase process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveUserDetails };