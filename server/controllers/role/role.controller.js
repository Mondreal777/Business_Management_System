// SERVICES
const service = require('../../services/role/role.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getRoleList(req, res) {
    try {
        
        const { body } = req;
        const result = await service.getRoleList(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001021, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getRoleById(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getRoleById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001022, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteRoleItem(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.deleteRoleById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001023, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveRole(req, res) {
    try {
        const { body } = req;
        const { roleDetails } = body;
        const result = await service.saveRole(body, roleDetails);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001024, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}



module.exports = { getRoleList, getRoleById, deleteRoleItem, saveRole }