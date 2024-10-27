// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const orderController = require('../../controllers/order/order.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/order/list', asyncHandler(orderController.getOrderList));
    
    // GET
    router.get('/order/:id', asyncHandler(orderController.getOrderById));

    // POST
    router.post('/order/save', asyncHandler(orderController.saveOrder));

    // POST
    router.post('/order/discount', asyncHandler(orderController.updateOrderDiscount));
    
    // POST
    router.post('/order/requested-discount', asyncHandler(orderController.updateRequestedOrderDiscount));

    // POST
    router.post('/order/surcharge', asyncHandler(orderController.updateOrderSurcharges));

    // POST
    router.post('/order/payment-details', asyncHandler(orderController.updateOrderPaymentDetails));

    // POST
    router.post('/order/payment-method', asyncHandler(orderController.updateOrderPaymentMethod));

    // POST
    router.post('/order/:id', asyncHandler(orderController.updateOrderStatus));
}