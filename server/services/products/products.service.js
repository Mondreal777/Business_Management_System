// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');
        
const fs = require('fs');
// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { ASCENDING } = require('../../util/constants/enums/sort');

// Database
const getProductListQuery = require('../../db-queries/products/get-product-list.query');
const getProductDetailsByProductIdQuery = require('../../db-queries/products/get-product-by-product-id.query');
const saveProductDetailsQuery = require('../../db-queries/products/save-product-details.query');
const deleteProductDetailsByIdQuery = require('../../db-queries/products/delete-product-details-by-id.query');
const getProductDetailsByIdQuery = require('../../db-queries/products/get-product-by-id.query');

// helpers
const converterHelper = require('../../util/helpers/converter');
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getProductList = async (payload, queryDetails) => {
    try {
        logger.info(`[getProductList] services.products.service.getProductList - START`);
        const { id: userId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;

        let queryValuesARR = [STATUS.ACTIVE];

        let sortBy = 'p.product_name';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';

        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'p.product_name';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (p.product_name LIKE ?)`;
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
        const getProductListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const { count } = await getProductListQuery.getProductListCount(getProductListParams);

        const inventoryList = await getProductListQuery.getProductList(getProductListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getProductList] services.products.service.getProductList - SUCCESS`);

        return { inventoryList, pagination }
        
    } catch (err) {
        logger.error(`[getProductList] services.products.service.getProductList: Error in getting products list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getProductList] services.products.service.getProductList - END`);
    }
}

exports.getProductDetailsByProductId = async (payload, params) => {
    const productId = parseInt(params.productId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getProductDetailsByProductId] services.product.service.getProductDetailsByProductId - START`);
        let productData = await getProductDetailsByProductIdQuery.getProductDetailsByProductId(productId);

        if (!productData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001014)
        }

        logger.info(`[getProductDetailsByProductId] services.product.service.getProductDetailsByProductId - SUCCESS`);

        return { productData: productData[0] }

    } catch (err) {
        logger.error(`[getProductDetailsByProductId] services.product.service.getProductDetailsByProductId: Error in getting product details by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getProductDetailsByProductId] services.product.service.getProductDetailsByProductId - END`);
    }
}

exports.saveProduct = async (payload, productDetails) => {
    const { id: loggedInUserId } = payload;
    const { productId, price, imageUrl, description  } = productDetails
    
    let result = null;

    try {
        logger.info(`[saveProduct] services.product.service.saveProduct - START`);

		const imageURLBase64 = await converterHelper.convertBlobToBase64(imageUrl);

        const productDetailParams = {
            productId, 
            price, 
            imageURLBase64, 
            description
        }

        // check if data is existing
        let productData = await getProductDetailsByProductIdQuery.getProductDetailsByProductId(productId);
        if (productData.length === 0) {
            // insert if data is not existing
            result = await saveProductDetailsQuery.saveProductDetails(productDetailParams);
        } else {
            // delete existing data to create new one later
            const deletedInventory = await deleteProductDetailsByIdQuery.deleteProductDetailsById(productData[0].id);

            if (!deletedInventory) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001015)
            }

            result = await saveProductDetailsQuery.saveProductDetails(productDetailParams);
        }
		console.log("result:: ", result)
        logger.info(`[saveProduct] services.product.service.saveProduct - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveProduct] services.product.service.saveProduct: Error in saving product details. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveProduct] services.product.service.saveProduct - END`);
    }
}

exports.deleteProductItem = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { id } = params
    let result = null;
    try {
        logger.info(`[deleteProductItem] services.product.service.deleteProductItem - START`);

        // check if data is existing
        let productData = await getProductDetailsByIdQuery.getProductDetailsById(id);
        if (!productData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001011)
        } else {
            // delete existing data to create new one later
           result = await deleteProductDetailsByIdQuery.deleteProductDetailsById(id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001016)
            }
        }

        logger.info(`[deleteProductItem] services.product.service.deleteProductItem - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteProductItem] services.product.service.deleteProductItem: Error in deleting product item. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteProductItem] services.product.service.deleteProductItem - END`);
    }
}