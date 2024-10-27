// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');

// DB Queries
const getPaymentMethodListQuery = require('../../db-queries/payment-method/get-payment-method-list.query');

exports.getPaymentMethodList = async (payload) => {
    try {
        logger.info(`[getPaymentMethodList] services.payment-method.service.getPaymentMethodList - START`);
        const { id: userId } = payload;

        const paymentMethodList = await getPaymentMethodListQuery.getPaymentMethodList();

        if (!paymentMethodList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001047);
        }

        logger.info(`[getPaymentMethodList] services.payment-method.service.getPaymentMethodList - SUCCESS`);

        return { paymentMethodList }
        
    } catch (err) {
        logger.error(`[getPaymentMethodList] services.payment-method.service.getPaymentMethodList: Error in getting payment-method list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getPaymentMethodList] services.payment-method.service.getPaymentMethodList - END`);
    }
}