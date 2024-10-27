// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { ASCENDING } = require('../../util/constants/enums/sort');

const getDiscountListQuery = require('../../db-queries/discount/get-discount-list.query');
const getDiscountByIdQuery = require('../../db-queries/discount/get-discount-by-id.query');
const saveDiscountQuery = require('../../db-queries/discount/save-discount.query');
const updateDiscountQuery = require('../../db-queries/discount/update-discount.query');
const deleteDiscountByIdQuery = require('../../db-queries/discount/delete-discount-by-id.query');
const updateDiscountStatusByIdQuery = require('../../db-queries/discount/update-discount-status-by-id.query');
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getDiscountList = async (payload, queryDetails) => {
    try {
        logger.info(`[getDiscountList] services.discount.service.getDiscountList - START`);
        const { id: userId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;

        let queryValuesARR = [STATUS.ACTIVE];

        let sortBy = 'd.discount_id';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';

        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'd.discount_id';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (d.discount_name LIKE ?)`;
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
        const getDiscountListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const { count } = await getDiscountListQuery.getDiscountListCount(getDiscountListParams);

        const discountList = await getDiscountListQuery.getDiscountList(getDiscountListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getDiscountList] services.discount.service.getDiscountList - SUCCESS`);

        return { discountList, pagination }
        
    } catch (err) {
        logger.error(`[getDiscountList] services.discount.service.getDiscountList: Error in getting discount list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getDiscountList] services.discount.service.getDiscountList - END`);
    }
}

exports.getDiscountById = async (payload, params) => {
    const discountId = parseInt(params.discountId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getDiscountById] services.discount.service.getDiscountById - START`);
        let discountData = await getDiscountByIdQuery.getDiscountById(discountId);

        if (!discountData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001018)
        }

        logger.info(`[getDiscountById] services.discount.service.getDiscountById - SUCCESS`);

        return { discountData: discountData[0] }

    } catch (err) {
        logger.error(`[getDiscountById] services.discount.service.getDiscountById: Error in getting discount details by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getDiscountById] services.discount.service.getDiscountById - END`);
    }
}

exports.saveDiscount = async (payload, discountDetails) => {
    const { id: loggedInUserId } = payload;
    const { discountId } = discountDetails;
    let result = null;
    try {
        logger.info(`[saveDiscount] services.discount.service.saveDiscount - START`);

        let discountData = [];
        // check if data is existing
        console.log("discountID: ", isNaN(discountId));
        if (!isNaN(discountId)) {
			console.log(123)
            discountData = await getDiscountByIdQuery.getDiscountById(discountId);
        }
		console.log(discountData)
        
        if (discountData.length === 0) {
            // insert if data is not existing
            result = await saveDiscountQuery.saveDiscount(discountDetails);
        } else {
            // delete existing data to create new one later
            // const deletedDiscount = await deleteDiscountByIdQuery.deleteDiscountById(discountData[0].id);

            // if (!deletedDiscount) {
            //     throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001019);
            // }

            result = await updateDiscountQuery.updateDiscount(discountDetails);
        }

        logger.info(`[saveDiscount] services.discount.service.saveDiscount - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveDiscount] services.discount.service.saveDiscount: Error in saving discount details. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveDiscount] services.discount.service.saveDiscount - END`);
    }
}

exports.updateDiscountStatus = async (payload, params) => {
	const { status } = payload;
	const { id } = params;

	try {
		logger.info(`[updateDiscountStatus] services.updateDiscountStatus - START`);

		let discountData = await getDiscountByIdQuery.getDiscountById(id);
		console.log(discountData)
		if (discountData.length === 0) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001055)
		}

		const param = {
			status,
			id
		}

		const result = updateDiscountStatusByIdQuery.updateDiscountStatusById(param);

		if (!result) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001056)
		}
		logger.info(`[updateDiscountStatus] services.updateDiscountStatus - SUCCESS`);

        return { result }
	} catch (err) {
		logger.error(`[updateDiscountStatus] services.updateDiscountStatus: Error in updating promo status. \n ${err.stack}`);
		throw err;
	} finally {
        logger.info(`[updateDiscountStatus] services.updateDiscountStatus - END`);
    }
}

exports.deleteDiscountById = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { id } = params
    let result = null;
    try {
        logger.info(`[deleteDiscountById] services.discount.service.deleteDiscountById - START`);

        // check if data is existing
        let discountData = await getDiscountByIdQuery.getDiscountById(id);
        if (!discountData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001020);
        } else {
            // delete existing data to create new one later
           result = await deleteDiscountByIdQuery.deleteDiscountById(id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001019)
            }
        }

        logger.info(`[deleteDiscountById] services.discount.service.deleteDiscountById - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteDiscountById] services.discount.service.deleteDiscountById: Error in deleting discount. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteDiscountById] services.discount.service.deleteDiscountById - END`);
    }
}