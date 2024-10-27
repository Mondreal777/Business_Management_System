const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
 async function getOrderDetailsById(transactionId, status = STATUS.ACTIVE) {
    try {
        let result = null;
        let query = `
                SELECT t.transaction_id,
                ti.transaction_id,
                ti.reference_no,
                ti.product_id,
                ti.quantity,
                ti.unit_price,
                t.items_price,
                t.discount,
                t.discount_value,
                t.service_charge,
                t.tax,
                t.total_price,
                t.created_by,
                t.created_date,
                t.modified_date,
                t.modified_by,
                t.organization_id,
                t.payment_method_id,
                t.table_id,
                t.status,
                ti.status
        FROM transaction t
        LEFT JOIN transaction_items ti ON ti.transaction_id = t.transaction_id
        WHERE ti.transaction_id = ? AND t.status = ? AND ti.status = ?`;

        let values = [transactionId, status, status]
        // Use normal query dabatase process
        result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getOrderDetailsById }