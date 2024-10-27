// Libraries
const asyncHandler = require('express-async-handler');

// Controllers
const healthCheckController = require('~/controllers/health-check/health-check.controller');

module.exports = (router) => {
    // GET
    /**
       * @swagger
       * /health-check:
       *   get:
       *     summary: Check database status
       *     description: Check the current status of the database
       *     tags:
	   *      - Health Check
       *     responses:
       *       200:
       *        description: OK
       *        content:
       *          application/json:
       *            schema:
       *              type: object
       *              properties:
       *                database:
       *                  type: object
       *                  properties:
       *                    status:
       *                      type: integer
       *                      example: 1
       */
    router.get('/health-check', asyncHandler(healthCheckController.healthCheck));
}