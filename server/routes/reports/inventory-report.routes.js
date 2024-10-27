// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const inventoryReportController = require('../../controllers/report/inventory-report.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/inventory-report/list', asyncHandler(inventoryReportController.getInventoryReportList));

}