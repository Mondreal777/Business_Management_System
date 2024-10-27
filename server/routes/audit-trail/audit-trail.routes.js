// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const auditTrailController = require('../../controllers/audit-trail/audit-trail.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // POST
    router.post('/audit-trail/save-audit-trail', asyncHandler(auditTrailController.saveAuditTrail));

    // GET
    router.get('/audit-trail/list', asyncHandler(auditTrailController.auditTrailList));
    router.get('/audit-trail/action-list', asyncHandler(auditTrailController.auditTrailActionList));
}