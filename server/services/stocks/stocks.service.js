// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { DEFAULTS } = require('../../util/constants/enums/default');

// Database
const saveStocksQuery = require('../../db-queries/stocks/save-stocks.query');
const getInventoryStocksQuery = require('../../db-queries/stocks/get-inventory-stocks.query');
const deleteInventoryStocksQuery = require('../../db-queries/stocks/delete-inventory-stocks.query');

exports.saveInventoryStocks = async (payload, stocksDetails) => {
    const { id: loggedInUserId } = payload;
    let { productId, threshold, quantity } = stocksDetails
    let result = null;
    try {
        logger.info(`[saveInventoryStocks] services.stocks.service.saveInventoryStocks - START`);
        if (!threshold) {
            threshold = DEFAULTS.DEFAULT_THRESHOLD;
        }

        const params = {
            productId,
            threshold,
            quantity
        }

        let stocksData = await getInventoryStocksQuery.getInventoryStocks(productId);

        if (stocksData.length === 0) {
            result = await saveStocksQuery.saveInventoryStocks(params)
        } else {
            const deleted = await deleteInventoryStocksQuery.deleteInventoryStocks(productId);

            if (!deleted) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001013);
            }

            result = await saveStocksQuery.saveInventoryStocks(params);
        }
        logger.info(`[saveInventoryStocks] services.stocks.service.saveInventoryStocks - SUCCESS`);
    } catch (err) {
        logger.error(`[saveInventoryStocks] services.stocks.service.saveInventoryStocks: Error in saving inventory stocks. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveInventoryStocks] services.stocks.service.saveInventoryStocks - END`);
    }
}

exports.reduceProductStocks = async (payload) => {
	let { productId, reduceQuantity } = payload;

	let result = null;
	try {
		logger.info(`[reduceProductStocks] services.stocks.service.reduceProductStocks - START`);
		let stocksData = await getInventoryStocksQuery.getInventoryStocks(productId);

		if (stocksData.length === 0) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001063);
		}

		let quantity = stocksData[0].quantity - reduceQuantity;

		const params = {
			productId,
			quantity,
			threshold: stocksData[0].threshold
		}

		const deleted = await deleteInventoryStocksQuery.deleteInventoryStocks(productId);

		if (!deleted) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001013);
		}

		result = await saveStocksQuery.saveInventoryStocks(params);

		logger.info(`[reduceProductStocks] services.stocks.service.reduceProductStocks - SUCCESS`);
	} catch (err) {
		logger.error(`[reduceProductStocks] services.stocks.service.reduceProductStocks: Error in reducing product stocks. \n ${err.stack}`);
		throw err;
	} finally {
        logger.info(`[reduceProductStocks] services.stocks.service.reduceProductStocks - END`);
    }
}