const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getUserDetailsByUserId(userId) {
    try {
        let result = null;
        let query = `
            SELECT u.user_id,
                    u.external_id,
                    u.username,
                    u.password,
                    u.status,
                    ud.user_details_id,
                    ud.last_name,
                    ud.first_name,
                    ud.middle_name,
                    ud.suffix,
                    ud.avatar_url,
                    ud.address_line_1,
                    ud.address_line_2,
                    ud.city,
                    ud.province,
                    ud.country,
                    ud.zip,
                    ud.email,
                    ud.contact_no,
                    ud.status,
                    ur.role_id,
                    r.role
			FROM user u
            LEFT JOIN user_details ud ON ud.user_id = u.user_id
            LEFT JOIN user_role ur ON ur.user_id = u.user_id
            LEFT JOIN role r ON r.role_id = ur.role_id
            WHERE u.status = ? AND ud.status = ? AND ur.status = ?
            AND u.user_id = ?`;

		// Use normal query dabatase process
		result = await pool.query(query, [STATUS.ACTIVE, STATUS.ACTIVE, STATUS.ACTIVE, userId]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getUserDetailsByUserId };