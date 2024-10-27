// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { ASCENDING } = require('../../util/constants/enums/sort');

// DB Queries
const getSalesReportListQuery = require('../../db-queries/reports/get-sales-report-list.query');

exports.getSalesReportList = async (payload, queryDetails) => {
    try {
        logger.info(`[getSalesReportList] services.getSalesReportList - START`);
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
        const getSalesReportListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery,
            status
        };

        const { count } = await getSalesReportListQuery.getSalesReportListCount(getSalesReportListParams);

        const salesList = await getSalesReportListQuery.getSalesReportList(getSalesReportListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getSalesReportList] services.getSalesReportList - SUCCESS`);

        return { salesList, pagination }
        
    } catch (err) {
        logger.error(`[getSalesReportList] services.getSalesReportList: Error in getting order list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getSalesReportList] services.getSalesReportList - END`);
    }
}