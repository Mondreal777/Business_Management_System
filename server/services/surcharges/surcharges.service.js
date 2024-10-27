// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { ASCENDING } = require('../../util/constants/enums/sort');
// DB Queries
const getSurchargesListQuery = require('../../db-queries/surcharges/get-surcharges-list.query');
const getSurchargesByIdQuery = require('../../db-queries/surcharges/get-surcharges-by-id.query');
const getSurchargesByOrderingSystemQuery = require('../../db-queries/surcharges/get-surcharges-by-ordering-system.query');
const saveSurchargesQuery = require('../../db-queries/surcharges/save-surcharges.query');
const updateSurchargesQuery = require('../../db-queries/surcharges/update-surcharges.query');
const deleteSurchargesByIdQuery = require('../../db-queries/surcharges/delete-surcharges-by-id.query');
const updateSurchargeStatusByIdQuery = require("../../db-queries/surcharges/update-surcharge-status-by-id.query");
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getSurchargesList = async (payload, queryDetails) => {
    try {
        logger.info(`[getSurchargesList] services.surcharges.service.getSurchargesList - START`);
        const { id: userId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;

        let queryValuesARR = [STATUS.ACTIVE];

        let sortBy = 's.surcharges_id';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';

        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 's.surcharges_id';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (s.surcharges_name LIKE ?)`;
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

        // Build get all inventory params
        const getSurchargesListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const { count } = await getSurchargesListQuery.getSurchargesListCount(getSurchargesListParams);

        const surchargesList = await getSurchargesListQuery.getSurchargesList(getSurchargesListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getSurchargesList] services.surcharges.service.getSurchargesList - SUCCESS`);

        return { surchargesList, pagination }
        
    } catch (err) {
        logger.error(`[getSurchargesList] services.surcharges.service.getSurchargesList: Error in getting surcharges list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getSurchargesList] services.surcharges.service.getSurchargesList - END`);
    }
}

exports.getSurchargesById = async (payload, params) => {
    const surchargesId = parseInt(params.surchargesId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getSurchargesById] services.surcharges.service.getsurchargestById - START`);
        let surchargesData = await getSurchargesByIdQuery.getSurchargesById(surchargesId);

        if (!surchargesData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001044)
        }

        logger.info(`[getSurchargesById] services.surcharges.service.getsurchargestById - SUCCESS`);

        return { surchargesData: surchargesData[0] }

    } catch (err) {
        logger.error(`[getSurchargesById] services.surcharges.service.getsurchargestById: Error in getting surcharges details by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getSurchargesById] services.surcharges.service.getsurchargestById - END`);
    }
}

exports.getSurchargesById = async (payload, params) => {
    const surchargesId = parseInt(params.surchargesId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getSurchargesById] services.surcharges.service.getsurchargestById - START`);
        let surchargesData = await getSurchargesByIdQuery.getSurchargesById(surchargesId);

        if (!surchargesData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001044)
        }

        logger.info(`[getSurchargesById] services.surcharges.service.getsurchargestById - SUCCESS`);

        return { surchargesData: surchargesData[0] }

    } catch (err) {
        logger.error(`[getSurchargesById] services.surcharges.service.getsurchargestById: Error in getting surcharges details by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getSurchargesById] services.surcharges.service.getsurchargestById - END`);
    }
}

exports.getSurchargesByOrderingSystem = async (payload, queryDetails) => {
    try {
        logger.info(`[getOrderList] services.getOrderList - START`);
        const { userId, userRoleId } = payload;
        const { page, limit, searchKeyword, orderBy, ordering_system, status = STATUS.ACTIVE } = queryDetails;
        
        let sortBy = 's.surcharges_id';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';
        let queryValuesARR = [];
        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === 'id') {
                sortBy = 's.surcharges_id';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (s.surcharges_id LIKE ?)`;
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
        const getSurchargesListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery,
            ordering_system,
            status
        };

        const { count } = await getSurchargesByOrderingSystemQuery.getSurchargesByOrderingSystemCount(getSurchargesListParams);

        const surchargeList = await getSurchargesByOrderingSystemQuery.getSurchargesByOrderingSystem(getSurchargesListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getOrderList] services.getOrderList - SUCCESS`);

        return { surchargeList, pagination }
        
    } catch (err) {
        logger.error(`[getOrderList] services.getOrderList: Error in getting order list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getOrderList] services.getOrderList - END`);
    }
}

exports.saveSurcharges = async (payload, surchargesDetails) => {
    const { id: loggedInUserId } = payload;

    const { surchargesId } = surchargesDetails;
    let result = null;
    try {
        logger.info(`[saveSurcharges] services.surcharges.service.savesurcharges - START`);

        let surchargesData = [];
        // check if data is existing
        if (!isNaN(surchargesId)) {
            surchargesData = await getSurchargesByIdQuery.getSurchargesById(surchargesId);
        }
        
        if (surchargesData.length === 0) {
            // insert if data is not existing
            result = await saveSurchargesQuery.saveSurcharges(surchargesDetails);
        } else {
            // delete existing data to create new one later
            
            result = await updateSurchargesQuery.updateSurcharges(surchargesDetails);
        }

        logger.info(`[saveSurcharges] services.surcharges.service.savesurcharges - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveSurcharges] services.surcharges.service.savesurcharges: Error in saving surcharges details. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveSurcharges] services.surcharges.service.savesurcharges - END`);
    }
}

exports.updateSurchargeStatus = async (payload, params) => {
	const { status } = payload;
	const { id } = params;

	try {
		logger.info(`[updateSurchargeStatus] services.updateSurchargeStatus - START`);

		let surchargeData = await getSurchargesByIdQuery.getSurchargesById(id);
		console.log(id)
		console.log(surchargeData)
		if (surchargeData.length === 0) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001057)
		}

		const param = {
			status,
			id
		}

		const result = updateSurchargeStatusByIdQuery.updateSurchargeStatusById(param);

		if (!result) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001058)
		}
		logger.info(`[updateSurchargeStatus] services.updateSurchargeStatus - SUCCESS`);

        return { result }
	} catch (err) {
		logger.error(`[updateSurchargeStatus] services.updateSurchargeStatus: Error in updating surcharge status. \n ${err.stack}`);
		throw err;
	} finally {
        logger.info(`[updateSurchargeStatus] services.updateSurchargeStatus - END`);
    }
}

exports.deleteSurchargesById = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { id } = params
    let result = null;
    try {
        logger.info(`[deleteSurchargesById] services.surcharges.service.deleteSurchargesById - START`);

        // check if data is existing
        let surchargesData = await getSurchargesByIdQuery.getSurchargesById(id);
        if (!surchargesData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001046);
        } else {
            // delete existing data to create new one later
           result = await deleteSurchargesByIdQuery.deleteSurchargesById(id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001045)
            }
        }

        logger.info(`[deleteSurchargesById] services.surcharges.service.deleteSurchargesById - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteSurchargesById] services.surcharges.service.deleteSurchargesById: Error in deleting surcharges. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteSurchargesById] services.surcharges.service.deleteSurchargesById - END`);
    }
}