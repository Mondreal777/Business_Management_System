// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');

// Success Response
const handleSuccessResponse = (res, message, result) => {
    if (result === '') {
        res.json({
            status: HTTP_STATUS.Success,
            results: {
                status: message
            }
        });
    } else {
        res.json({
            status: HTTP_STATUS.Success,
            results: {
                status: message,
                data: result
            }
        });
    }
}

// Success Image Response
const handleSuccessImageResponse = (res, result) => {
    res.status(200).set('Content-Type', 'image/jpeg');
    res.write(result, 'binary');
    res.end(null, 'binary');
}

// Error Response
const handleErrorResponse = (res, err) => {
    if (err && err.statusCode) {
        res.status(err.statusCode)
            .json({
                status: err.statusCode,
                error: {
                    code: err.code,
                    message: err.message
                }
            });
    } else {
        res.status(HTTP_STATUS.InternalServerError)
            .json({
                status: HTTP_STATUS.InternalServerError,
                error: 'Something went wrong. Please contact your administrator.'
            });
    }
}

module.exports = { handleSuccessResponse, handleSuccessImageResponse, handleErrorResponse };
