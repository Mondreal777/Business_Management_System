// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { DESCENDING } = require('../../util/constants/enums/sort');

// DB Queries
const getInventoryReportListQuery = require('../../db-queries/reports/get-inventory-report-list.query');

exports.getInventoryReportList = async (payload, queryDetails) => {
    try {
        logger.info(`[getInventoryReportList] services.getInventoryReportList - START`);
        const { userId, userRoleId } = payload;
        const { page, limit, searchKeyword, orderBy, status = STATUS.ACTIVE } = queryDetails;
        
        let sortBy = 's.modified_date';
        let sortOrder = DESCENDING.label;

        let limitQuery = '';
        let whereClause = '';
        let queryValuesARR = [];
        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === 'id') {
                sortBy = 's.modified_date';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (s.modified_date LIKE ?)`;
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
        const getInventoryReportListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery,
            status
        };

        const { count } = await getInventoryReportListQuery.getInventoryReportListCount(getInventoryReportListParams);

        const inventoryReportList = await getInventoryReportListQuery.getInventoryReportList(getInventoryReportListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getInventoryReportList] services.getInventoryReportList - SUCCESS`);

        return { inventoryReportList, pagination }
        
    } catch (err) {
        logger.error(`[getInventoryReportList] services.getInventoryReportList: Error in getting inventory report list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getInventoryReportList] services.getInventoryReportList - END`);
    }
}
