// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { ASCENDING } = require('../../util/constants/enums/sort');
// DB Queries
const getPromosListQuery = require('../../db-queries/promos/get-promos-list.query');
const getPromosListByIdQuery = require('../../db-queries/promos/get-promos-by-id.query');
const savePromosQuery = require('../../db-queries/promos/save-promos.query');
const updatePromosByIdQuery = require('../../db-queries/promos/update-promos-by-id.query');
const deletePromosByIdQuery = require('../../db-queries/promos/delete-promos-by-id.query');
const savePromoProductsQuery = require('../../db-queries/promos/save-promo-products.query');
const deletePromoProductsQuery = require('../../db-queries/promos/delete-promo-products-by-id.query');
const updatePromoStatusByIdQuery = require('../../db-queries/promos/update-promo-status-by-id.query');
// Helpers
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getPromosList = async (payload, queryDetails) => {
    try {
        logger.info(`[getPromosList] services.getPromosList - START`);
        const { userId, userRoleId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;
        
        let sortBy = 'p.name';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';
        let queryValuesARR = [];
        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'p.name';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (p.name LIKE ?)`;
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

        // Build get all promos params
        const getPromosListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const { count } = await getPromosListQuery.getPromosList(getPromosListParams);

        const promosList = await getPromosListQuery.getPromosList(getPromosListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getPromosList] services.getPromosList - SUCCESS`);

        return { promosList, pagination }
        
    } catch (err) {
        logger.error(`[getPromosList] services.getPromosList: Error in getting purchase request list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getPromosList] services.getPromosList - END`);
    }
}

/**
 * 
 * @param {Object} payload
 * @param {Object} promosDetails { name, productId, desciption, price, duration, time, orderLimit, createdBy, createdDate, status, id}
 */
 exports.savePromos = async (promosDetails) => {
    let result = null;
    try {
        logger.info(`[savePromos] services.savePromos - START`);
		// check if data is existing
        let promosData = await getPromosListByIdQuery.getPromosById(promosDetails["id"]);
		if (promosData.length === 0) {
            // insert if data is not existing
            result = await savePromosQuery.savePromos(promosDetails);
            if(result){
                promosDetails["promoProducts"].forEach(element => {
                    const { product } = element;
                    savePromoProductsQuery.savePromoProducts(product, result);
                });
            }
        } else {
			 // delete existing data to create new one later
			 const deletedInventory = await deletePromosByIdQuery.deletePromosById(promosData[0].id);

			 if (!deletedInventory) {
				 throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001035)
			 }

            result = await updatePromosByIdQuery.updatePromosById(promosDetails);
            if(result){
                
                result = await deletePromoProductsQuery.deletePromoProductsById(promosData[0].id);
                promosDetails["promoProducts"].forEach(element => {
                    const { product_id } = element;
                    savePromoProductsQuery.savePromoProducts(product_id, promosData[0].id);
                });
            }
        }

        logger.info(`[savePromos] services.savePromos - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[savePromos] services.savePromos: Error in saving purchase request. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[savePromos] services.savePromos - END`);
    }
}

exports.updatePromoStatus = async (payload, params) => {
	const { status } = payload;
	const { id } = params;

	try {
		logger.info(`[updatePromoStatus] services.updatePromoStatus - START`);

		let promosData = await getPromosListByIdQuery.getPromosById(id);

		if (promosData.length === 0) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001053)
		}

		const param = {
			status,
			id
		}

		const result = updatePromoStatusByIdQuery.updatePromoStatusById(param);

		if (!result) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001054)
		}
		logger.info(`[updatePromoStatus] services.updatePromoStatus - SUCCESS`);

        return { result }
	} catch (err) {
		logger.error(`[updatePromoStatus] services.updatePromoStatus: Error in updating promo status. \n ${err.stack}`);
		throw err;
	} finally {
        logger.info(`[updatePromoStatus] services.updatePromoStatus - END`);
    }
}

exports.deletePromos = async (payload, params) => {
    const { id } = params
    
    let result = null;
    try {
        logger.info(`[deletePromos] services.deletePromos - START`);

        // check if data is existing
        let promosData = await getPromosListByIdQuery.getPromosById(id);
        if (!promosData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001032)
        } else {
            // delete existing data to create new one later
           result = await deletePromosByIdQuery.deletePromosById(id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001033)
            }
        }

        logger.info(`[deletePromos] services.deletePromos - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deletePromos] services.deletePromos: Error in deleting promo item. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deletePromos] services.deletePromos - END`);
    }
}

exports.getPromosProductsList = async (payload, params) => {
    try {
        logger.info(`[getPromosProductsList] services.getPromosProductsList - START`);
        const { userId } = payload;
        const { id } = params
        console.log("payload",payload);
        console.log("params",params);
        const promoProductsList = await getPromosListQuery.getPromoProductsList(id)

        if (!promoProductsList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001029);
        }

        logger.info(`[getPromosProductsList] services.getPromosProductsList - SUCCESS`);

        return promoProductsList;
        
    } catch (err) {
        logger.error(`[getPromosProductsList] services.getPromosProductsList: Error in getting promo products list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getPromosProductsList] services.getPromosProductsList - END`);
    }
}

exports.getPromosById = async (payload, params) => {
    try {
        logger.info(`[getPromosById] services.getPromosById - START`);
        const { userId } = payload;
        const { id } = params

        const promosList = await getPromosListByIdQuery.getPromosById(id)

        if (!promosList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001029);
        }

        logger.info(`[getPromosById] services.getPromosById - SUCCESS`);

        return { promosList: promosList[0] }
        
    } catch (err) {
        logger.error(`[getPromosById] services.getPromosById: Error in getting promo list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getPromosById] services.getPromosById - END`);
    }
}
