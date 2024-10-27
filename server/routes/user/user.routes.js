// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const userController = require('../../controllers/user/user.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // POST
    router.post('/register-user', asyncHandler(userController.registerUser));

    // POST
    router.post('/login',  asyncHandler(userController.loginUser));

    // POST
    router.post('/update-user', asyncHandler(userController.updateUser));

    // DELETE
    router.delete('/delete-user/:userId', asyncHandler(userController.deleteUserAccount));
}