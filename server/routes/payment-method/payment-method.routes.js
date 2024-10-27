// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const paymentMethodController = require('../../controllers/payment-method/payment-method.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/payment-method/list', asyncHandler(paymentMethodController.getPaymentMethodList));

}