// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const inventoryController = require('../../controllers/inventory/inventory.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/inventory-list', asyncHandler(inventoryController.getInventoryList));

    // GET
    router.get('/inventory/not-product/list', asyncHandler(inventoryController.getInventoryListNotOnProduct));

    // GET
    router.get('/inventory/:inventoryId', asyncHandler(inventoryController.getInventoryById));

    // PUT
    router.put('/inventory/on-product/:inventoryId', asyncHandler(inventoryController.updateInventoryOnProductStatus));

    // POST
    router.post('/save-inventory-details', asyncHandler(inventoryController.saveInventory));

    // DELETE
    router.delete('/delete-inventory-item/:inventoryId', asyncHandler(inventoryController.deleteInventoryItem));
}