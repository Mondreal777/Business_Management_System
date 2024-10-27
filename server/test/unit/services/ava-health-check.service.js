// Testing Libraries
const test = require('ava');
const sinon = require('sinon');

// Libraries
const Errors = require('http-errors');

// Constants
const { HTTP_STATUS } = require('~/util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('~/util/constants/messages/error-messages');

// Loggers
const logger = require('~/util/loggers/logger');

// Service
const service = require('~/services/health-check/health-check.service');

// Database Queries
const healthCheckQuery = require('~/db-queries/health-check/health-check.query');

// SetUp
test.beforeEach(() => {
    sandbox = sinon.createSandbox();
    transactionSpy = {
        executeQuery: sandbox.spy(),
        release: sandbox.spy()
    };

    healthCheckQuery.healthCheck = sandbox.stub();

    // pool.connection = sandbox.stub().returns(transactionSpy);

    logger.info = sandbox.spy();
    logger.error = sandbox.spy();
});

// Teardown
test.afterEach.always(() => {
    sandbox.restore();
});

test.serial('healthCheck_success', async t => {
    // Arrange
	const dbResult = {
		status: 1
	};

    healthCheckQuery.healthCheck.returns(dbResult);

    // Act
    const result = await service.healthCheck();

    // Assert
    t.truthy(result);
    t.true(healthCheckQuery.healthCheck.called);
    t.truthy(result.database);
	t.truthy(result.database.status);
    t.true(logger.info.called);
});

test.serial('healthCheck_dbNoValidResponse_throwsException', async t => {
    // Arrange
    const expectedError = new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.EX4005001);

    healthCheckQuery.healthCheck.returns([]);

    // Act
	const error = await t.throwsAsync(service.healthCheck());

    // Assert
    t.deepEqual(error, expectedError);
    t.true(logger.error.called);
});