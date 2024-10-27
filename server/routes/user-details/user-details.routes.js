// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const userController = require('../../controllers/user-details/user-details.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/user-details/list', asyncHandler(userController.getUserList));

    // GET
    router.get('/user-details/:userId', asyncHandler(userController.getUserDetailsByUserId));

    // POST
    router.post('/user-details/save-details', asyncHandler(userController.saveUserDetails));

    // DELETE
    router.delete('/user-details/delete/:id', asyncHandler(userController.deleteUserDetail));
}