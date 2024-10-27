// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const promosController = require('../../controllers/promos/promos.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/promos', asyncHandler(promosController.getPromosList));

    // GET
    router.get('/promo-products/:id', asyncHandler(promosController.getPromoProductsList));
    
    // GET
    router.get('/get-promos-by-id/:id', asyncHandler(promosController.getPromosById));

    // POST
    router.post('/save-promos', asyncHandler(promosController.savePromos));

	// POST
	router.post('/update-promo-status/:id', asyncHandler(promosController.updatePromoStatus));

    // DELETE
    router.delete('/delete-promos/:id', asyncHandler(promosController.deletePromos));
}