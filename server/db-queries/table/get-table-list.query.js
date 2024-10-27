// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')

/**
 * 
 * @param {Object} params
 */
 async function getTableList(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery } = params;
        
        let result = null;
        let query = '';
        let valuesQuery = '';
        
        query = `SELECT * FROM tables t
				WHERE t.status = 'A'`;  
        valuesQuery = [STATUS.ACTIVE];      
        
        query += whereClause;
        query += orderByScript;
        query += limitQuery;
        
        result = await pool.query(query, [valuesQuery, values]);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getTableListCount(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery } = params;
        
        let result = null;
        let query = '';
        let valuesQuery = '';
        
        query = `SELECT COUNT(*) as count
				FROM tables t
				WHERE t.status = 'A'`;  
        valuesQuery = [STATUS.ACTIVE];      
        
        query += whereClause;
        query += orderByScript;
        query += limitQuery;
        
        result = await pool.query(query, [valuesQuery, values]);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getTableList, getTableListCount }