// Database
const pool = require('../../util/database/pool');

const { STATUS } = require('../../util/constants/status/status');
/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function saveOrder(params, status = STATUS.ACTIVE) {
    try {
        let result = null;

        const {
            receipt_number,
            order_type, 
            items_price, 
            discount, 
            discount_value,
            discount_id_number, 
            imageURLBase64, 
            service_charge, 
            tax,
            total_price, 
            table_id, 
            organization_id, 
            special_instructions,             
            payment_method } = params;

        const query = `INSERT INTO 
            transaction (
                receipt_number,
                order_type, 
                items_price, 
                discount, 
                discount_value, 
                discount_id_number, 
                discount_image_url,
                service_charge, 
                tax,                 
                total_price, 
                table_id, 
                organization_id, 
                special_instructions, 
                payment_method_id, 
                status
                )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            receipt_number,
            order_type, 
            items_price, 
            discount, 
            discount_value, 
            discount_id_number, 
            imageURLBase64, 
            service_charge, 
            tax,
            total_price, 
            table_id, 
            organization_id, 
            special_instructions, 
            payment_method, 
            status
        ];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const tableId = result.insertId;

        return tableId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { saveOrder };