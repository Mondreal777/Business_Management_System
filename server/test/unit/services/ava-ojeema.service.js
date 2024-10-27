// Testing Libraries
const test = require('ava');
const sinon = require('sinon');

// Libraries
const Errors = require('http-errors');

// Constants
const { HTTP_STATUS } = require('../../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../../util/constants/messages/error-messages');

// Helpers
const ojeemaHelper = require('../../../util/helpers/ojeema');

// Loggers
const logger = require('../../../util/loggers/logger');

// Service
const service = require('../../../services/ojeema/ojeema.service');

// Mock Data
const ojeemaMockData = require('../../../test/mocks/utils/ojeema.json');
const ojeemaFormattedResultMockData = require('../../../test/mocks/utils/ojeemaFormattedResult.json');

// SetUp
test.beforeEach(() => {
    sandbox = sinon.createSandbox();
    transactionSpy = {
        executeQuery: sandbox.spy(),
        release: sandbox.spy()
    };

    ojeemaHelper.getOjeemaBillingDetailsByBillingId = sandbox.stub();
    ojeemaHelper.billingDetailsFormatter = sandbox.stub();

    // pool.connection = sandbox.stub().returns(transactionSpy);

    logger.info = sandbox.spy();
    logger.error = sandbox.spy();
});

// Teardown
test.afterEach.always(() => {
    sandbox.restore();
});

test.serial('getOjeemaBillingDetailsById_validParams_success', async t => {
    // Arrange
    const params =  {
        billingNo: 'BILL00001'
    }


    ojeemaHelper.getOjeemaBillingDetailsByBillingId.returns(ojeemaMockData);
    ojeemaHelper.billingDetailsFormatter.returns(ojeemaFormattedResultMockData);

    // Act
    const result = await service.getOjeemaBillingDetailsById(params);

    // Assert
    t.truthy(result);
    t.true(ojeemaHelper.getOjeemaBillingDetailsByBillingId.called);
    t.true(ojeemaHelper.getOjeemaBillingDetailsByBillingId.called);
    t.truthy(result.status);
    t.truthy(result.results.status);
    t.truthy(result.results.data);
    t.true(logger.info.called);
});

test.serial('getOjeemaBillingDetailsById_noExistingBillingDetails_throwsException', async t => {
    // Arrange
    const expectedError = new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.EX4003001);

    const params =  {
        billingNo: 'BILL00001'
    }

    ojeemaHelper.getOjeemaBillingDetailsByBillingId.returns([]);
    
    // Act
    const error = await t.throwsAsync(service.getOjeemaBillingDetailsById(params));

    // Assert
    t.deepEqual(error, expectedError);
    t.true(logger.error.called);
});