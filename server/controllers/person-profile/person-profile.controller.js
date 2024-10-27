// Services
const service = require('~/services/person-profile/person-profile.service');

// Helpers
const { handleSuccessResponse, handleErrorResponse } = require('~/util/helpers/handle-response');

// Constants
const { SUCCESS_MESSAGE }  = require('~/util/constants/messages/success-messages');

async function getAllPersonProfileInformation(req, res) {
    try {
        const { payload } = req;
        const result = await service.getAllPersonProfileInformation(payload);
        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001001, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getAllPersonProfileInformation };