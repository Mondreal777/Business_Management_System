// Database
const { STATUS } = require('../../util/constants/status/status');
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 */
 async function getUserList(params) {
    try {
        let result = null;
        const { whereClause, orderByScript, queryValues: values , limitQuery } = params;
        let query = `
            SELECT u.user_id,
                    u.external_id,
                    u.username,
                    u.password,
                    u.status,
					u.changed_pass,
					DATE_FORMAT(u.created_date, "%m/%d/%Y") as created_date,
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
            WHERE u.status = ? AND ud.status = ? AND ur.status = ?`;

        query += whereClause;
        query += orderByScript;
        query += limitQuery;

		// Use normal query dabatase process
		result = await pool.query(query, [STATUS.ACTIVE, STATUS.ACTIVE, STATUS.ACTIVE, values]);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * 
 * @param {Object} params
 */
 async function getUserListCount(params) {
    try {
        let result = null;
        const { whereClause, queryValues: values  } = params;
        let query = `
            SELECT COUNT(*) as count
			FROM user u
            LEFT JOIN user_details ud ON ud.user_id = u.user_id
            LEFT JOIN user_role ur ON ur.user_id = u.user_id
            LEFT JOIN role r ON r.role_id = ur.role_id
            WHERE u.status = ? AND ud.status = ? AND ur.status = ?`;

        query += whereClause;

		// Use normal query dabatase process
		result = await pool.query(query, [STATUS.ACTIVE, STATUS.ACTIVE, STATUS.ACTIVE, values]);
        const count = result[0].count;

        return { count };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getUserList, getUserListCount };