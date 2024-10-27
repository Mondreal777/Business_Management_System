// Libraries
const Errors = require('http-errors');
const logger = require('../../util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { ASCENDING } = require('../../util/constants/enums/sort');
// DB Queries
const getTableListQuery = require('../../db-queries/table/get-table-list.query');
const getTableByIdQuery = require('../../db-queries/table/get-table-by-id.query');
const getTableByTableNoQuery = require('../../db-queries/table/get-table-by-table_no.query');
const insertTableQuery = require('../../db-queries/table/insert-table.query');
const updateTableQuery = require('../../db-queries/table/update-table.query');
const deleteTablequery = require('../../db-queries/table/delete-table.query');

// Helpers
const { generateUrlQrCode } = require('../../util/helpers/qr-code');
const { servers } = require('../../config/config');
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getTableList = async (payload, queryDetails) => {
    try {
        logger.info(`[getTableList] services.getTableList - START`);
        const { userId, userRoleId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;
        
        let sortBy = 't.id';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';
        let queryValuesARR = [];
        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === 'id') {
                sortBy = 't.id';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (t.table_no LIKE ?)`;
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

        // Build get all table params
        const getTableListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const { count } = await getTableListQuery.getTableListCount(getTableListParams);

        const tableList = await getTableListQuery.getTableList(getTableListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getTableList] services.getTableList - SUCCESS`);

        return { tableList, pagination }
        
    } catch (err) {
        logger.error(`[getTableList] services.getTableList: Error in getting table list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getTableList] services.getTableList - END`);
    }
}

/**
 * 
 * @param {Object} payload
 * 
 */
 exports.saveTable = async (tableDetails) => {
    let result = null;
	const { tableName, tableNo, capacity, occupancy, status: tableStatus, tableId: id } = tableDetails;
    try {
        logger.info(`[saveTable] services.saveTable - START`);
        // check if data is existing
        let tableData = await getTableByIdQuery.getTableById(id);
		const url = `${servers.WEB_SERVER_NAME}/order/${tableNo}`;
		const qrCode = await generateUrlQrCode(url);
		const tableDetailParams = {
			tableNo,
            tableName,
			capacity,
			url,
			qrCode,
            occupancy,
			tableStatus,
			id
		}
        if (tableData.length === 0) {
            // insert if data is not existing
            result = await insertTableQuery.saveTable(tableDetailParams);
        } else {
            tableDetailParams.id = tableData[0].id
            result = await updateTableQuery.updateTableById(tableDetailParams);
        }

        logger.info(`[saveTable] services.saveTable - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveTable] services.saveTable: Error in saving table. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveTable] services.saveTable - END`);
    }
}

exports.deleteTable = async (payload, params) => {
    const { id } = params
    
    let result = null;
    try {
        logger.info(`[deleteTable] services.deleteTable - START`);

        // check if data is existing
        let tableData = await getTableByIdQuery.getTableById(id);
        if (tableData.length === 0) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001034)
        } else {
            // delete existing data to create new one later
           result = await deleteTablequery.deleteTableById(id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001035)
            }
        }

        logger.info(`[deleteTable] services.deleteTable - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteTable] services.deleteTable: Error in deleting inventory item. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteTable] services.deleteTable - END`);
    }
}

exports.getTableById = async (payload, params) => {
    try {
        logger.info(`[getTableById] services.getTableById - START`);
        const { userId } = payload;
        const { id } = params

        const tableData = await getTableByIdQuery.getTableById(id)

        if (tableData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001034);
        }

        logger.info(`[getTableById] services.getTableById - SUCCESS`);

        return { tableData: tableData }
        
    } catch (err) {
        logger.error(`[getTableById] services.getTableById: Error in getting table by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getTableById] services.getTableById - END`);
    }
}


exports.getTableByTableNo = async (payload, params) => {
    try {
        logger.info(`[getTableByTableNo] services.getTableByTableNo - START`);
        const { userId } = payload;
        const { tableNo } = params

        const tableData = await getTableByTableNoQuery.getTableByTableNo(tableNo)

        if (tableData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001034);
        }

        logger.info(`[getTableByTableNo] services.getTableByTableNo - SUCCESS`);

        return { tableData: tableData }
        
    } catch (err) {
        logger.error(`[getTableByTableNo] services.getTableByTableNo: Error in getting table by table no. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getTableByTableNo] services.getTableByTableNo - END`);
    }
}