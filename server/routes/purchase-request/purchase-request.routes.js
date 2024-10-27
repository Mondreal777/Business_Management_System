// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const purchaseRequestController = require('../../controllers/purchase-request/purchase-request.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // POST
    router.post('/purchase-request-list', asyncHandler(purchaseRequestController.getPurchaseRequestList));
    
    router.post('/purchase-request-list-complete', asyncHandler(purchaseRequestController.getPurchaseRequesStatustCompleteList));

    // GET
    router.get('/get-purchase-request-by-reference-no/:referenceNo', asyncHandler(purchaseRequestController.getPurchaseRequestByReferenceNo));

    // GET
    router.get('/get-purchase-request-by-reference-no-and-id/:referenceNo/:purchaseRequestId', asyncHandler(purchaseRequestController.getPurchaseRequestByReferenceNoAndId));

    // POST
    router.post('/save-purchase-request', asyncHandler(purchaseRequestController.savePurchaseRequest));
    
    // POST
    router.post('/update-purchase-request', asyncHandler(purchaseRequestController.updatePurchaseRequest));
    
    // POST
    router.post('/update-status-purchase-request', asyncHandler(purchaseRequestController.updateStatusPurchaseRequest));

    // POST
    router.post('/purchasing-check-items', asyncHandler(purchaseRequestController.checkItemsOfPurchaseRequest));
    
    // POST
    router.post('/purchasing-received-items', asyncHandler(purchaseRequestController.receivedItemsOfPurchaseRequest));

    // DELETE
    router.delete('/delete-purchase-request/:purchaseRequestId', asyncHandler(purchaseRequestController.deletePurchaseRequest));
}