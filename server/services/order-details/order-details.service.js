// Libraries
const Errors = require('http-errors');
const logger = require('../../util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { ASCENDING } = require('../../util/constants/enums/sort');
// DB Queries
const saveOrderDetailsQuery = require('../../db-queries/order-details/save-order-details.query');
const updateOrderDetailsQuery = require('../../db-queries/order-details/update-order-details-by-transaction-id.query');
const getOrderDetailsListByTransactionIdQuery = require('../../db-queries/order-details/get-order-details-by-order-id-done.query')
const getOrderDetailsByIdQuery = require('../../db-queries/order-details/get-order-details-by-order-id.query');
const getOrderDetailsByTableIdQuery = require('../../db-queries/order-details/get-order-details-table-id.query');
const updateOrderDetailsStatusByOrderIdQuery = require('../../db-queries/order-details/update-order-details-status-by-order-id.query');
const updateOrderDetailsStatusQuery = require('../../db-queries/order-details/update-order-details-status.query');
const deletedOrderDetailsByIdQuery = require('../../db-queries/order-details/delete-order-details-by-id.query');
const getOrderDetailsByIdAndProductIdQuery = require('../../db-queries/order-details/get-order-details-by-product-id-and-order-id.query');
const { STATUS } = require('../../util/constants/status/status');

/**
 * 
 * @param {orderItemDetails}  Object = transaction_id, product_id, quantity, unit_price, total_price
 * @returns {orderItemsId}
 */
exports.saveOrderDetails = async (orderItemDetails) => {
    let result = null;
	const { transaction_id, product_id, quantity, unit_price, total_price } = orderItemDetails;
    try {
        logger.info(`[saveOrderDetails] services.saveOrderDetails - START`);
        const orderItemDetailParams = {
            transaction_id, 
            product_id, 
            quantity, 
            unit_price, 
            total_price,
        }
        // check if data is existing
        const orderItemsListData = await getOrderDetailsByIdAndProductIdQuery.getOrderDetailsByIdAndProductId(transaction_id, product_id)
		console.log(orderItemsListData);
		if (orderItemsListData.length === 0) {
			result = await saveOrderDetailsQuery.saveOrderDetails(orderItemDetailParams);
		} else {
            const deletedOrderItems = await deletedOrderDetailsByIdQuery.deleteOrderDetailsById(orderItemsListData[0].transaction_item_id);

            if (!deletedOrderItems) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001015)
            }
            result = await saveOrderDetailsQuery.saveOrderDetails(orderItemDetailParams);
        }

        logger.info(`[saveOrderDetails] services.saveOrderDetails - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveOrderDetails] services.saveOrderDetails: Error in saving orderItems. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveOrderDetails] services.saveOrderDetails - END`);
    }
}

exports.getOrderDetailsListByTransactionId = async (payload, params) => {
    try {
        logger.info(`[getOrderDetailsListByTransactionId] services.getOrderDetailsListByTransactionId - START`);
        const { userId } = payload;
        const { transactionId } = params

        const orderItemsListData = await getOrderDetailsListByTransactionIdQuery.getOrderDetailsListByTransactionId(transactionId)

        if (orderItemsListData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038);
        }

        logger.info(`[getOrderDetailsListByTransactionId] services.getOrderDetailsListByTransactionId - SUCCESS`);

        return { orderItemsListData }
        
    } catch (err) {
        logger.error(`[getOrderDetailsListByTransactionId] services.getOrderDetailsListByTransactionId: Error in getting orderItems by transaction id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getOrderDetailsListByTransactionId] services.getOrderDetailsListByTransactionId - END`);
    }
}

exports.getOrderDetailsListById = async (payload, params) => {
    try {
        logger.info(`[getOrderDetailsListById] services.getOrderDetailsListById - START`);
        const { userId } = payload;
        const { transactionId } = params

        const orderItemsListData = await getOrderDetailsByIdQuery.getOrderDetailsById(transactionId)

        if (orderItemsListData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038);
        }

        logger.info(`[getOrderDetailsListById] services.getOrderDetailsListById - SUCCESS`);

        return { orderItemsListData }
        
    } catch (err) {
        logger.error(`[getOrderDetailsListById] services.getOrderDetailsListById: Error in getting orderItems by transaction id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getOrderDetailsListById] services.getOrderDetailsListById - END`);
    }
}

exports.getOrderDetailsByTableId = async (payload, params) => {
    try {
        logger.info(`[getOrderDetailsByTableId] services.getOrderDetailsByTableId - START`);
        const { userId } = payload;
        const { tableId } = params

        const orderItemsData = await getOrderDetailsByTableIdQuery.getOrderDetailsByTableId(tableId)

        if (orderItemsData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038);
        }

        logger.info(`[getOrderDetailsByTableId] services.getOrderDetailsByTableId - SUCCESS`);

        return { orderItemsData }
        
    } catch (err) {
        logger.error(`[getOrderDetailsByTableId] services.getOrderDetailsByTableId: Error in getting orderItems by table id. \n ${err.stack}`);
		return null;
    } finally {
        logger.info(`[getOrderDetailsByTableId] services.getOrderDetailsByTableId - END`);
    }
}

exports.updateOrderDetailsStatus = async (payload, params) => {
    const { id, status } = params
    
    let result = null;
    try {
        logger.info(`[updateOrderDetailsStatus] services.updateOrderDetailsStatus - START`);

        // check if data is existing
        let orderItemsData = await getOrderDetailsByIdQuery.getOrderDetailsById(id);
        if (orderItemsData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            // delete existing data to create new one later
           	result = await updateOrderDetailsStatusQuery.updateOrderDetailsStatusById(id, status);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001043)
            }
        }

        logger.info(`[updateOrderDetailsStatus] services.updateOrderDetailsStatus - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[updateOrderDetailsStatus] services.updateOrderDetailsStatus: Error in deleting orderItems. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderDetailsStatus] services.updateOrderDetailsStatus - END`);
    }
}

exports.updateOrderDetailsStatusByOrderId = async (payload) => {
    const { transactionId } = payload
    
    let result = null;
    try {
        logger.info(`[updateOrderDetailsStatusByOrderId] services.updateOrderDetailsStatusByOrderId - START`);

        // check if data is existing
        let orderItemsData = await getOrderDetailsByIdQuery.getOrderDetailsById(transactionId);
        if (orderItemsData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            // delete existing data to create new one later
           	result = await updateOrderDetailsStatusByOrderIdQuery.updateOrderDetailsStatusByOrderId(payload);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001043)
            }
        }

        logger.info(`[updateOrderDetailsStatusByOrderId] services.updateOrderDetailsStatusByOrderId - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[updateOrderDetailsStatusByOrderId] services.updateOrderDetailsStatusByOrderId: Error in updating orderItems status. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderDetailsStatusByOrderId] services.updateOrderDetailsStatusByOrderId - END`);
    }
}
