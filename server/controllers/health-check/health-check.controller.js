// Services
const service = require('~/services/health-check/health-check.service');

// Helpers
const { handleSuccessResponse, handleErrorResponse } = require('~/util/helpers/handle-response');

const healthCheck = async (req, res) => {
    try {
        const result = await service.healthCheck();

        res.json(result); 
    } catch (err) {
        handleErrorResponse(res, err);
    }
};

module.exports = { healthCheck };