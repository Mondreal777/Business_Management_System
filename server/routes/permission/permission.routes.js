// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const permissionController = require('../../controllers/permission/permission.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/permission/list', asyncHandler(permissionController.getPermissionList));

}