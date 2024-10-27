// Database
const pool = require('../../util/database/pool');
const { PURCHASE_REQUEST_STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
 async function getPurchaseRequestList(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery, userId, userRoleId } = params;
        
        let result = null;
        let query = '';
        let valuesQuery = '';
        
        if (userRoleId == 1 || userRoleId == 2 || userRoleId == 4 || userRoleId == 3){
            query = `SELECT p.*, u.username as approved_by_username, v.username as request_by_username, DATE_FORMAT(p.request_date, "%m/%d/%Y") as request_date from purchase_request p 
                         left join user u on p.approve_by = u.user_id 
                         left join user v on p.request_by = v.user_id
                         where p.status <> ?`;  
            valuesQuery = [PURCHASE_REQUEST_STATUS.DELETED];      
        } else {
            query = `SELECT p.*, u.username as approved_by_username, v.username as request_by_username, DATE_FORMAT(p.request_date, "%m/%d/%Y") as request_date from purchase_request p 
                         left join user u on p.approve_by = u.user_id
                         left join user v on p.request_by = v.user_id
                         where p.status = ? or p.status = ? or p.status = ?`;  
            valuesQuery = [PURCHASE_REQUEST_STATUS.APPROVE, PURCHASE_REQUEST_STATUS.IN_PROGRESS, PURCHASE_REQUEST_STATUS.COMPLETED];      
        }
        
        query += whereClause;
        query += orderByScript;
        query += limitQuery;
        
        result = await pool.query(query, valuesQuery);
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
 async function getPurchaseRequestStatusCompleteList(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery, userId, userRoleId } = params;
        
        let result = null;
        let query = '';
        let valuesQuery = '';
        
        query = `SELECT p.*, u.username as approved_by_username, v.username as request_by_username, DATE_FORMAT(p.request_date, "%m/%d/%Y") as request_date from purchase_request p 
                        left join user u on p.approve_by = u.user_id
                        left join user v on p.request_by = v.user_id
                        where p.status = ?`;  
        valuesQuery = [PURCHASE_REQUEST_STATUS.COMPLETED];      
        
        query += whereClause;
        query += orderByScript;
        query += limitQuery;
        
        result = await pool.query(query, valuesQuery);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPurchaseRequestList, getPurchaseRequestStatusCompleteList}