// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const categoryController = require('../../controllers/category/category.controller');

// Middlewares
// const { auth } = require('../../middlewares/auth');
const schemaValidator = require('../../middlewares/schema-validator');

// Validators

module.exports = (router) => {
    // GET
    router.get('/category-list', asyncHandler(categoryController.getCategoryList));

}