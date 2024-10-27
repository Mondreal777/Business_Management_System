// SERVICES
const service = require('../../services/user/user.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function registerUser(req, res) {
    try {
        
        const { body } = req;
        const result = await service.registerUser(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001002, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function loginUser(req, res) {
    try {
        
        const { body } = req;
        const result = await service.loginUser(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001003, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateUser(req, res) {
    try {
        const { body } = req;
        const result = await service.updateUser(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001003B, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteUserAccount(req, res) {
    try {
        const { body, params } = req;
        const result = await service.deleteUserAccount(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001006, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { registerUser, loginUser, updateUser, deleteUserAccount }