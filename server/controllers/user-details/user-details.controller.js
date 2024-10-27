// SERVICES
const service = require('../../services/user-details/user-details.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getUserList(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getUserList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001017, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}


async function getUserDetailsByUserId(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getUserDetailsByUserId(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001018, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveUserDetails(req, res) {
    try {
        const { body } = req;
        const { userDetails } = body;
        const result = await service.saveUserDetails(body, userDetails);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001019, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteUserDetail(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.deleteUserDetail(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001020, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}


module.exports = { getUserList, getUserDetailsByUserId, saveUserDetails, deleteUserDetail }