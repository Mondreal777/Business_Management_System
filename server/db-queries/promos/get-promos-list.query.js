// Database
const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')

/**
 * 
 * @param {Object} params
 */
 async function getPromosList(params) {
    try {
        const { whereClause, orderByScript, queryValues: values , limitQuery } = params;
        
        let result = null;
        let query = '';
        let valuesQuery = '';
        
        query = `SELECT p.*, u.username as created_by_username from promos p 
                left join products pr on pr.product_id = p.product_id
                left join user u on u.user_id = p.created_by 
                where p.status <> ?`;  
        valuesQuery = [STATUS.DELETED];      
        
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

async function getPromoProductsList(id) {
    try {
        
        let result = null;
        
        query = `SELECT * from promo_products
                where promo_id = ?`;  
        valuesQuery = [id];      
        
        result = await pool.query(query, valuesQuery);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = { getPromosList, getPromoProductsList }