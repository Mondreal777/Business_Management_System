// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const personProfileController = require('../../controllers/person-profile/person-profile.controller');

module.exports = (router) => {
    router.get('/persons', asyncHandler(personProfileController.getAllPersonProfileInformation));
}