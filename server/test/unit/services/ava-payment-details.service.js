// Testing Libraries
const test = require('ava');
const sinon = require('sinon');

// Libraries
const Errors = require('http-errors');

// Constants
const { HTTP_STATUS } = require('../../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../../util/constants/messages/error-messages');

// Helpers
const xmlHelper = require('../../../util/helpers/xml-helper');
const converterHelper = require('../../../util/helpers/converter');

// Loggers
const logger = require('../../../util/loggers/logger');

// Service
const service = require('../../../services/payment-details/payment-details.service');

// Database
const pool = require('../../../util/database/pool');

// Database Query
const getPaymentDetailsByIdQuery = require('../../../db-queries/payment-details/get-payment-details-by-id.query');
const deletePaymentDetailsQuery = require('../../../db-queries/payment-details/delete-payment-details.query');
const addPaymentDetailsQuery = require('../../../db-queries/payment-details/add-payment-details.query');

// Mock Data
const getPaymentDetailsByIdQueryMockData = require('../../../test/mocks/db-queries/getPaymentDetailsByIdQuery.json');
const deletePaymentDetailsQueryMockData = require('../../../test/mocks/db-queries/deletePaymentDetailsQuery.json');
const signatureConvertedResult = require('../../../test/mocks/utils/xmlParser.json');

// SetUp
test.beforeEach(() => {
    sandbox = sinon.createSandbox();
    transactionSpy = {
        executeQuery: sandbox.spy(),
        release: sandbox.spy()
    };

    xmlHelper.xmlParser = sandbox.stub();
    converterHelper.convertB64toString = sandbox.stub();
    getPaymentDetailsByIdQuery.getPaymentDetailsById = sandbox.stub();
    deletePaymentDetailsQuery.deletePaymentDetails = sandbox.stub();
    addPaymentDetailsQuery.addPaymentDetails = sandbox.stub();

    pool.connection = sandbox.stub().returns(transactionSpy);

    logger.info = sandbox.spy();
    logger.error = sandbox.spy();
});

// Teardown
test.afterEach.always(() => {
    sandbox.restore();
});

test.serial('updatePaymentDetails_validParams_hasExistingDataOnDB_success', async t => {
    // Arrange
    const body =  {
        initialPaymentDetails: {
            billingId: ' BILL0001',
            payment_response: '',
            requestId: '100dkaodfa1q',
            grossAmount: 10000,
            status: 'PENDING',
            signature: 'qtwqhrqeefdbsdbfsb='
        }
    }

    const addPaymentDetailsQueryReturn = 25;

    converterHelper.convertB64toString.returns('<?xml version="1.0" encoding="utf-8" ?><Request><orders><items><Items><itemname>Item One</itemname><quantity>1</quantity><amount>610.00</amount></Items><Items><itemname>Item One</itemname><quantity>2</quantity><amount>249.00</amount></Items></items></orders><mid>000000161021625C1B6C</mid><request_id>32fe3dd448a39</request_id><ip_address>127.0.0.1</ip_address><notification_url>http://localhost:8085/api/payment-success</notification_url><response_url>http://localhost:8080/payment-success</response_url><cancel_url>http://localhost:8080</cancel_url><mtac_url></mtac_url><descriptor_note></descriptor_note><fname>Zoe</fname><lname>Ayala</lname><mname></mname><address1>Tower One & Exchange Plaza, Ayala Triangle, Ayala Avenue, Makati City, Metro Manila 1226</address1><address2></address2><city></city><state></state><country>PH</country><zip></zip><secure3d>try3d</secure3d><trxtype>sale</trxtype><email>billing@ayalaland.com.ph</email><phone></phone><mobile>0790-838-82__</mobile><client_ip>124.106.192.7</client_ip><amount>1108.00</amount><currency>PHP</currency><mlogo_url>https://fore-sight.tech/wp-content/uploads/2021/08/viber_image_2021-08-11_14-07-03-759__2__auto_x2-removebg-preview.png</mlogo_url><pmethod></pmethod><signature>5b95d32e8dc1d5505d6559ef8c7f4034d19430f64309f09f72e70d9c99f9619fa9da41c27782011a10449e92c0c00254f434cd0f98f175357e19a284236a2854</signature></Request>');
    xmlHelper.xmlParser.returns(signatureConvertedResult);
    getPaymentDetailsByIdQuery.getPaymentDetailsById.returns(getPaymentDetailsByIdQueryMockData);
    deletePaymentDetailsQuery.deletePaymentDetails.returns(deletePaymentDetailsQueryMockData);
    addPaymentDetailsQuery.addPaymentDetails.returns(addPaymentDetailsQueryReturn);

    // Act
    const result = await service.updatePaymentDetails(body);

    // Assert
    t.truthy(result);
    t.true(converterHelper.convertB64toString.called);
    t.true(xmlHelper.xmlParser.called);
    t.true(getPaymentDetailsByIdQuery.getPaymentDetailsById.called);
    t.true(deletePaymentDetailsQuery.deletePaymentDetails.called);
    t.true(addPaymentDetailsQuery.addPaymentDetails.called);
    t.true(logger.info.called);
});


test.serial('updatePaymentDetails_validParams_noExistingDataOnDB_success', async t => {
    // Arrange
    const body =  {
        initialPaymentDetails: {
            billingId: ' BILL0001',
            payment_response: '',
            requestId: '100dkaodfa1q',
            grossAmount: 10000,
            status: 'PENDING',
            signature: 'qtwqhrqeefdbsdbfsb='
        }
    }

    const addPaymentDetailsQueryReturn = 25;

    converterHelper.convertB64toString.returns('<?xml version="1.0" encoding="utf-8" ?><Request><orders><items><Items><itemname>Item One</itemname><quantity>1</quantity><amount>610.00</amount></Items><Items><itemname>Item One</itemname><quantity>2</quantity><amount>249.00</amount></Items></items></orders><mid>000000161021625C1B6C</mid><request_id>32fe3dd448a39</request_id><ip_address>127.0.0.1</ip_address><notification_url>http://localhost:8085/api/payment-success</notification_url><response_url>http://localhost:8080/payment-success</response_url><cancel_url>http://localhost:8080</cancel_url><mtac_url></mtac_url><descriptor_note></descriptor_note><fname>Zoe</fname><lname>Ayala</lname><mname></mname><address1>Tower One & Exchange Plaza, Ayala Triangle, Ayala Avenue, Makati City, Metro Manila 1226</address1><address2></address2><city></city><state></state><country>PH</country><zip></zip><secure3d>try3d</secure3d><trxtype>sale</trxtype><email>billing@ayalaland.com.ph</email><phone></phone><mobile>0790-838-82__</mobile><client_ip>124.106.192.7</client_ip><amount>1108.00</amount><currency>PHP</currency><mlogo_url>https://fore-sight.tech/wp-content/uploads/2021/08/viber_image_2021-08-11_14-07-03-759__2__auto_x2-removebg-preview.png</mlogo_url><pmethod></pmethod><signature>5b95d32e8dc1d5505d6559ef8c7f4034d19430f64309f09f72e70d9c99f9619fa9da41c27782011a10449e92c0c00254f434cd0f98f175357e19a284236a2854</signature></Request>');
    xmlHelper.xmlParser.returns(signatureConvertedResult);
    getPaymentDetailsByIdQuery.getPaymentDetailsById.returns([]);
    addPaymentDetailsQuery.addPaymentDetails.returns(addPaymentDetailsQueryReturn);

    // Act
    const result = await service.updatePaymentDetails(body);

    // Assert
    t.truthy(result);
    t.true(converterHelper.convertB64toString.called);
    t.true(xmlHelper.xmlParser.called);
    t.true(getPaymentDetailsByIdQuery.getPaymentDetailsById.called);
    t.true(addPaymentDetailsQuery.addPaymentDetails.called);
    t.true(logger.info.called);
});

test.serial('updatePaymentDetails_nullInitialPaymentDetails_throwsException', async t => {
    // Arrange
    const expectedError = new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.EX4004001);

    const body = [];
    
    // Act
    const error = await t.throwsAsync(service.updatePaymentDetails(body));

    // Assert
    t.deepEqual(error, expectedError);
    t.true(logger.error.called);
});

test.serial('updatePaymentDetails_failedToAddPaymentDetail_throwsException', async t => {
    // Arrange
    const expectedError = new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.EX4004003);

    const body =  {
        initialPaymentDetails: {
            billingId: ' BILL0001',
            payment_response: '',
            requestId: '100dkaodfa1q',
            grossAmount: 10000,
            status: 'PENDING',
            signature: 'qtwqhrqeefdbsdbfsb='
        }
    }

    const addPaymentDetailsQueryResult = null;

    converterHelper.convertB64toString.returns('<?xml version="1.0" encoding="utf-8" ?><Request><orders><items><Items><itemname>Item One</itemname><quantity>1</quantity><amount>610.00</amount></Items><Items><itemname>Item One</itemname><quantity>2</quantity><amount>249.00</amount></Items></items></orders><mid>000000161021625C1B6C</mid><request_id>32fe3dd448a39</request_id><ip_address>127.0.0.1</ip_address><notification_url>http://localhost:8085/api/payment-success</notification_url><response_url>http://localhost:8080/payment-success</response_url><cancel_url>http://localhost:8080</cancel_url><mtac_url></mtac_url><descriptor_note></descriptor_note><fname>Zoe</fname><lname>Ayala</lname><mname></mname><address1>Tower One & Exchange Plaza, Ayala Triangle, Ayala Avenue, Makati City, Metro Manila 1226</address1><address2></address2><city></city><state></state><country>PH</country><zip></zip><secure3d>try3d</secure3d><trxtype>sale</trxtype><email>billing@ayalaland.com.ph</email><phone></phone><mobile>0790-838-82__</mobile><client_ip>124.106.192.7</client_ip><amount>1108.00</amount><currency>PHP</currency><mlogo_url>https://fore-sight.tech/wp-content/uploads/2021/08/viber_image_2021-08-11_14-07-03-759__2__auto_x2-removebg-preview.png</mlogo_url><pmethod></pmethod><signature>5b95d32e8dc1d5505d6559ef8c7f4034d19430f64309f09f72e70d9c99f9619fa9da41c27782011a10449e92c0c00254f434cd0f98f175357e19a284236a2854</signature></Request>');
    xmlHelper.xmlParser.returns(signatureConvertedResult);
    getPaymentDetailsByIdQuery.getPaymentDetailsById.returns(getPaymentDetailsByIdQueryMockData);
    deletePaymentDetailsQuery.deletePaymentDetails.returns(deletePaymentDetailsQueryMockData);
    addPaymentDetailsQuery.addPaymentDetails.returns(addPaymentDetailsQueryResult);
    
    // Act
    const error = await t.throwsAsync(service.updatePaymentDetails(body));

    // Assert
    t.deepEqual(error, expectedError);
    t.true(logger.error.called);
});