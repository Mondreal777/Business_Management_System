// Database
const pool = require('../../util/database/pool');

/**
 * 
 * @param {Object} params
 * @param {String} status
 */
 async function savePurchaseRequestItems(params, purchaseRequestId) {
    try {
        let result = null;

        const { itemName, quantity, unitOfMeasurement, unitPrice } = params;
        const query = `INSERT INTO purchase_request_items (purchase_request_id, item_name, quantity, unit_of_measurement, unit_price)
        VALUES (?, ?, ?, ?, ?)`;
        const values = [ purchaseRequestId, itemName, quantity, unitOfMeasurement, unitPrice];

		// Use normal query dabatase process
		result = await pool.query(query, values);
        const purchaseRequestItemsId = result.insertId;

        return purchaseRequestItemsId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { savePurchaseRequestItems };