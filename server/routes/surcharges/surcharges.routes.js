// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const surchargesController = require('../../controllers/surcharges/surcharges.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/surcharges/list', asyncHandler(surchargesController.getSurchargesList));

    // GET
    router.get('/surcharges/edit/:surchargesId', asyncHandler(surchargesController.getSurchargesById));
    
    // GET
    router.get('/surcharges/list/ordering-system', asyncHandler(surchargesController.getSurchargesByOrderingSystem));

    // POST
    router.post('/surcharges/save-details', asyncHandler(surchargesController.saveSurcharges));

	// POST
    router.post('/surcharges/update-status/:id', asyncHandler(surchargesController.updateSurchargeStatus));

    // DELETE
    router.delete('/surcharges/delete/:id', asyncHandler(surchargesController.deleteSurcharges));
}