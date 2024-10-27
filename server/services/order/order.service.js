// Libraries
const Errors = require('http-errors');
const logger = require('../../util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { ASCENDING } = require('../../util/constants/enums/sort');
// DB Queries
const saveOrderQuery = require('../../db-queries/order/save-order.query');
const getOrderListQuery = require('../../db-queries/order/get-order-list.query');
const getOrderByIdQuery = require('../../db-queries/order/get-order-by-id.query');
const getOrderByTableIdQuery = require('../../db-queries/order/get-order-by-table-id.query');
const updateOrderQuery = require('../../db-queries/order/update-order.query');
const updateOrderDiscountQuery = require('../../db-queries/order/update-order-discount.query');
const updateOrderSurchargesQuery = require('../../db-queries/order/update-order-surcharge.query');
const updateOrderStatusQuery = require('../../db-queries/order/update-order-status.query');
const updateOrderPaymentMethodQuery = require('../../db-queries/order/update-order-payment-method.query');
const deletedOrderByIdQuery = require('../../db-queries/order/delete-order-by-id.query');
const updateOrderPaymentDetailsQuery = require('../../db-queries/order/update-order-payment-details.query');
const { STATUS } = require('../../util/constants/status/status');

// helpers
const converterHelper = require('../../util/helpers/converter');

exports.getOrderList = async (payload, queryDetails) => {
    try {
        logger.info(`[getOrderList] services.getOrderList - START`);
        const { userId, userRoleId } = payload;
        const { page, limit, searchKeyword, orderBy, status = STATUS.ACTIVE } = queryDetails;
        
        let sortBy = 't.transaction_id';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';
        let queryValuesARR = [];
        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === 'id') {
                sortBy = 't.transaction_id';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (t.transaction_id LIKE ?)`;
            queryValuesARR.push(`%${searchKeyword.toLowerCase()}%`);
        }

        // Pagination
        if (page !== undefined && limit !== undefined && page !== '' && limit !== '') {
            // Check if page and limit is a valid number
            if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001008);
            }

            limitQuery = ` LIMIT ?,? `;
            // Compute offset
            let offset = (page * limit) - limit;
            queryValuesARR.push(offset);
            queryValuesARR.push(parseInt(limit));
        }

        // Build get all order params
        const getOrderListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery,
            status
        };

        const { count } = await getOrderListQuery.getOrderListCount(getOrderListParams);

        const orderList = await getOrderListQuery.getOrderList(getOrderListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getOrderList] services.getOrderList - SUCCESS`);

        return { orderList, pagination }
        
    } catch (err) {
        logger.error(`[getOrderList] services.getOrderList: Error in getting order list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getOrderList] services.getOrderList - END`);
    }
}

/**
 * 
 * @param {orderDetails}  Object = orderId, order_type, items_price, discount, discount_value, discount_image_url, service_charge, tax, total_price, table_id, organization_id, payment_method, special_instructions
 * @returns {orderId}
 */
exports.saveOrder = async (orderDetails) => {
    let result = null;
	const { 
        orderId,
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
        payment_method, } = orderDetails;

    try {
        logger.info(`[saveOrder] services.saveOrder - START`);
		const imageURLBase64 = await converterHelper.convertBlobToBase64(discount_image_url);

        const orderDetailParams = {
            orderId,
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
        }
        // check if data is existing
        let orderData = await getOrderByIdQuery.getOrderById(orderId);

        if (orderData.length === 0) {
            // insert if data is not existing
            result = await saveOrderQuery.saveOrder(orderDetailParams);
        } else {
            const deletedOrder = await deletedOrderByIdQuery.deleteOrderById(orderData[0].transaction_id);

            if (!deletedOrder) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001015)
            }
            result = await saveOrderQuery.saveOrder(orderDetailParams);
        }

		if (!result) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001037);
		}

        logger.info(`[saveOrder] services.saveOrder - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveOrder] services.saveOrder: Error in saving order. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveOrder] services.saveOrder - END`);
    }
}

exports.getOrderById = async (payload, params) => {
    try {
        logger.info(`[getOrderById] services.getOrderById - START`);
        const { userId } = payload;
        const { id } = params

        const orderData = await getOrderByIdQuery.getOrderById(id)

        if (orderData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038);
        }

        logger.info(`[getOrderById] services.getOrderById - SUCCESS`);

        return { orderData }
        
    } catch (err) {
        logger.error(`[getOrderById] services.getOrderById: Error in getting order by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getOrderById] services.getOrderById - END`);
    }
}

exports.updateOrderStatus = async (payload, params) => {
    const { id } = params;
    const { status } = payload;
    let result = null;
    try {
        logger.info(`[updateOrderStatus] services.updateOrderStatus - START`);

        // check if data is existing
        let orderData = await getOrderByIdQuery.getOrderById(id);
        if (orderData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            // delete existing data to create new one later
           result = await updateOrderStatusQuery.updateOrderStatusById(id, status);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001035)
            }
        }

        logger.info(`[updateOrderStatus] services.updateOrderStatus - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[updateOrderStatus] services.updateOrderStatus: Error in deleting order. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderStatus] services.updateOrderStatus - END`);
    }
}

exports.updateOrderDiscount = async (payload, params) => {
    const { id } = params;
    let result = null;
    try {
        logger.info(`[updateOrderDiscount] services.updateOrderDiscount - START`);
        
        // check if data is existing
        let orderData = await getOrderByIdQuery.getOrderById(payload.id);
        
        if (orderData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            orderData = orderData[0];
            result = await updateOrderDiscountQuery.updateOrderDiscount(payload, STATUS.ACTIVE, orderData.service_charge);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001035)
            }
        
            logger.info(`[updateOrderDiscount] services.updateOrderDiscount - SUCCESS`);

            return { result }
        }
    } catch (err) {
        logger.error(`[updateOrderDiscount] services.updateOrderDiscount: updating order discount. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderDiscount] services.updateOrderDiscount - END`);
    }
}

exports.updateRequestedOrderDiscount = async (payload, params) => {
    const { id } = params;
    let result = null;
    try {
        logger.info(`[updateOrderDiscount] services.updateOrderDiscount - START`);
        
        // check if data is existing
        let orderData = await getOrderByIdQuery.getOrderById(payload.id);
        
        if (orderData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            orderData = orderData[0];
            result = await updateOrderDiscountQuery.updateRequestedOrderDiscount(payload, STATUS.ACTIVE);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001035)
            }
        
            logger.info(`[updateOrderDiscount] services.updateOrderDiscount - SUCCESS`);

            return { result }
        }
    } catch (err) {
        logger.error(`[updateOrderDiscount] services.updateOrderDiscount: Error in updating order discount. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderDiscount] services.updateOrderDiscount - END`);
    }
}

exports.updateOrderSurcharges = async (payload, params) => {
    const { id } = params;
    let result = null;
    try {
        logger.info(`[updateOrderDiscount] services.updateOrderDiscount - START`);
        
        // check if data is existing
        let orderData = await getOrderByIdQuery.getOrderById(payload.id);
        
        if (orderData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            orderData = orderData[0];
            result = await updateOrderSurchargesQuery.updateOrderSurcharges(payload, STATUS.ACTIVE, orderData.discount_value);
            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001035)
            }
        
            logger.info(`[updateOrderSurcharges] services.updateOrderSurcharges - SUCCESS`);

            return { result }
        }
    } catch (err) {
        logger.error(`[updateOrderSurcharges] services.updateOrderSurcharges: Error in deleting order. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderSurcharges] services.updateOrderSurcharges - END`);
    }
}

exports.updateOrderPaymentDetails = async (payload, params) => {
    const { id } = params;
    let result = null;

    try {
        logger.info(`[updateOrderPaymentDetails] services.updateOrderPaymentDetails - START`);

        // check if data is existing
        let orderData = await getOrderByIdQuery.getOrderById(payload.id);
        
        if (orderData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            result = await updateOrderPaymentDetailsQuery.updateOrderPaymentDetails(payload, STATUS.ACTIVE);
        
            logger.info(`[updateOrderPaymentDetails] services.updateOrderPaymentDetails - SUCCESS`);

            return { result }
        }

    } catch (err) {
        logger.error(`[updateOrderPaymentDetails] services.updateOrderPaymentDetails: Error in saving order. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderPaymentDetails] services.updateOrderPaymentDetails - END`);
    }
}

exports.updateOrderPaymentMethod = async (payload, params) => {
    const { id } = params;
    let result = null;
    try {
        logger.info(`[updateOrderPaymentMethod] services.updateOrderPaymentMethod - START`);
        
        // check if data is existing
        let orderData = await getOrderByIdQuery.getOrderById(payload.id);
        
        if (orderData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001038)
        } else {
            result = await updateOrderPaymentMethodQuery.updateOrderPaymentMethod(payload, STATUS.ACTIVE);
            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001035)
            }
        
            logger.info(`[updateOrderPaymentMethod] services.updateOrderPaymentMethod - SUCCESS`);

            return { result }
        }
    } catch (err) {
        logger.error(`[updateOrderPaymentMethod] services.updateOrderPaymentMethod: Error in deleting order. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateOrderPaymentMethod] services.updateOrderPaymentMethod - END`);
    }
}

