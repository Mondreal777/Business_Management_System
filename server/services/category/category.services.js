// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');

// DB Queries
const getCategoryListQuery = require('../../db-queries/category/get-category-list.query');

exports.getCategoryList = async (payload) => {
    try {
        logger.info(`[getCategoryList] services.category.service.getCategoryList - START`);
        const { id: userId } = payload;

        const categoryList = await getCategoryListQuery.getCategoryList();

        if (!categoryList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001012);
        }

        logger.info(`[getCategoryList] services.category.service.getCategoryList - SUCCESS`);

        return { categoryList }
        
    } catch (err) {
        logger.error(`[getCategoryList] services.category.service.getCategoryList: Error in getting categorys list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getCategoryList] services.category.service.getCategoryList - END`);
    }
}