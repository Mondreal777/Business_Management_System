// Libraries
const joi = require('joi');

// Constants
const getOjeemaBillingDetailsById = {
    POST: joi.object().keys({
        billingNo: joi
            .string()	
            .max(45)	
            .required()
    })
};

module.exports = { getOjeemaBillingDetailsById };