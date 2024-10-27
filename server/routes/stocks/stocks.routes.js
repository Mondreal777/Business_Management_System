// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const stocksController = require('../../controllers/stocks/stocks.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // POST
    router.post('/save-inventory-stocks', asyncHandler(stocksController.saveInventoryStocks));

	// POST
	router.post('/update-stocks-quantity', asyncHandler(stocksController.reduceProductStocks));
}