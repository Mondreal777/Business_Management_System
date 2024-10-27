const pool = require('../../util/database/pool');
const { STATUS } = require('../../util/constants/status/status')
/**
 * 
 * @param {Object} params
 */
 async function getOrderDetailsByTableId(tableId, status = STATUS.ACTIVE) {
    try {
        let result = null;
        let query = `
                SELECT t.transaction_id,
                t.receipt_number,
                ti.transaction_id,
                t.table_id,
                tb.table_no,
                ti.reference_no,
                ti.product_id,
                p.product_name,
                ti.quantity,
                ti.unit_price,
                t.order_type,
                t.items_price,
                t.discount,
                t.discount_value,
                t.applied_discount_value,
                t.discount_id_number,
                t.discount_image_url,
                t.service_charge,
                t.applied_service_charge,
                t.tax,
                t.tip,
                t.total_price,
                t.created_by,
                t.created_date,
                t.modified_date,
                t.modified_by,
                t.organization_id,
                t.payment_method_id,                
                t.status,
                ti.status
        FROM transaction t
        LEFT JOIN transaction_items ti ON ti.transaction_id = t.transaction_id
        LEFT JOIN products p ON p.product_id = ti.product_id
        LEFT JOIN tables tb ON t.table_id = tb.id
        WHERE t.table_id = ? AND t.status = ? AND ti.status = ?`;

        let values = [tableId, status, status]
        // Use normal query dabatase process
        result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getOrderDetailsByTableId }