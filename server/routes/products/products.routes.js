// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const productController = require('../../controllers/products/products.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/product/list', asyncHandler(productController.getProductList));

    // GET
    router.get('/product/:productId', asyncHandler(productController.getProductDetailsByProductId));

    // POST
    router.post('/product/save-details', asyncHandler(productController.saveProduct));

    // DELETE
    router.delete('/product/delete/:id', asyncHandler(productController.deleteProductItem));
}