// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const roleController = require('../../controllers/role/role.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/role/list', asyncHandler(roleController.getRoleList));

    // GET
    router.get('/role/:roleId', asyncHandler(roleController.getRoleById));

    // POST
    router.post('/role/save-details', asyncHandler(roleController.saveRole));

    // DELETE
    router.delete('/role/delete/:id', asyncHandler(roleController.deleteRoleItem));

}