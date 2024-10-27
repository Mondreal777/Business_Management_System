// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const discountController = require('../../controllers/discount/discount.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/discount/list', asyncHandler(discountController.getDiscountList));

    // GET
    router.get('/discount/:discountId', asyncHandler(discountController.getDiscountById));

    // POST
    router.post('/discount/save-details', asyncHandler(discountController.saveDiscount));

	// POST
    router.post('/discount/update-status/:id', asyncHandler(discountController.updateDiscountStatus));

    // DELETE
    router.delete('/discount/delete/:id', asyncHandler(discountController.deleteDiscountItem));
}