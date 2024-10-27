// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const tableController = require('../../controllers/table/table.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/table/list', asyncHandler(tableController.getTableList));
    
    // GET
    router.get('/table/:id', asyncHandler(tableController.getTableById));

    // GET
    router.get('/table/table-no/:tableNo', asyncHandler(tableController.getTableByTableNo));

    // POST
    router.post('/table/save', asyncHandler(tableController.saveTable));

    // DELETE
    router.delete('/table/delete/:id', asyncHandler(tableController.deleteTable));
}