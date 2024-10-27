// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function updateOrder(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const { 
            order_type, 
            items_price, 
            discount, 
            discount_value, 
            imageURLBase64, 
            service_charge, 
            tax, 
            total_price,
            table_id, 
            organization_id, 
            payment_method, 
            orderId } = params;

        const query = `UPDATE transaction t 
                SET order_type = ?, 
                items_price = ?, 
                discount= ?, 
                discount_value = ?, 
                discount_image_url = ?, 
                service_charge = ?, 
                tax = ?,
                total_price = ?,
                table_id = ?, 
                organization_id = ?, 
                payment_method_id = ?, 
                status = ? 
                WHERE t.transaction_id = ?`;
        
        const values = [
            order_type, 
            items_price, 
            discount, 
            discount_value, 
            imageURLBase64, 
            service_charge, 
            tax, 
            total_price,
            table_id, 
            organization_id, 
            payment_method, 
            status, 
            orderId
        ];


		// Use normal query database process
		result = await pool.query(query, values);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { updateOrder };