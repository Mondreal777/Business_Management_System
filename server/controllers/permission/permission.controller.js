// SERVICES
const service = require('../../services/permission/permission.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getPermissionList(req, res) {
    try {
        
        const { body } = req;
        const result = await service.getPermissionList(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001052, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}


module.exports = { getPermissionList }