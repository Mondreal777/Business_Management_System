// SERVICES
const service = require('../../services/user-role-permission/user-role-permission.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getRolePermissionList(req, res) {
    try {
        
        const { body } = req;
        const result = await service.getRolePermissionList(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001053, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getRolePermissionByRoleId(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getRolePermissionByRoleId(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001054, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}


async function deleteRolePermissionByRoleId(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.deleteRolePermissionById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001055, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveRolePermission(req, res) {
    try {
        const { body } = req;
        const { roleDetails } = body;
        const result = await service.saveRolePermission(body, roleDetails);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001056, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}



module.exports = { getRolePermissionList, getRolePermissionByRoleId, deleteRolePermissionByRoleId, saveRolePermission }