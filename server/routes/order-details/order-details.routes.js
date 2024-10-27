// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const orderDetailsController = require('../../controllers/order-details/order-details.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {

    // GET
    router.get('/order-item/:tableId', asyncHandler(orderDetailsController.getOrderDetailsByTableId));

    // GET
    router.get('/order-item/list/:transactionId', asyncHandler(orderDetailsController.getOrderDetailsListByTransactionId));

    // GET
    router.get('/order-items/:transactionId', asyncHandler(orderDetailsController.getOrderDetailsListById));
    
    // POST
    router.post('/order-item/save', asyncHandler(orderDetailsController.saveOrderDetails));

    // POST
    router.post('/order-item/status', asyncHandler(orderDetailsController.updateOrderDetailsStatusByOrderId));

    // POST
    router.post('/order-item/:id', asyncHandler(orderDetailsController.updateOrderDetailsStatus));
}