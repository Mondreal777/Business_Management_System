// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const rolePermission = require('../../controllers/user-role-permission/user-role-permission.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/role-permission/list', asyncHandler(rolePermission.getRolePermissionList));
    
	// GET
    router.get('/role-permission/:roleId', asyncHandler(rolePermission.getRolePermissionByRoleId));

    // POST
    router.post('/role-permission/save-details', asyncHandler(rolePermission.saveRolePermission));

    // DELETE
    router.delete('/role-permission/delete/:roleId', asyncHandler(rolePermission.deleteRolePermissionByRoleId));

}