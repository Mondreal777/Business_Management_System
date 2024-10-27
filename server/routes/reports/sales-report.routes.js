// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const salesReportController = require('../../controllers/report/sales-report.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/sales-report/list', asyncHandler(salesReportController.getSalesReportList));

}