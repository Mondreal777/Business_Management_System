// Libraries
const Errors = require('http-errors');
const _ = require('lodash');

// Loggers
const logger = require('../util/loggers/logger');

// Joi validation options
const _validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
};

const convertContextKey = (str) => {
    // Used _.startCase to make the camelcase string a title case.
    const convertedStr = _.lowerCase(_.startCase(str));

    // Remove ' id' from the string if there is.
    const idIndex = convertedStr.indexOf(' id');

    return idIndex > -1 ? convertedStr.slice(0, convertedStr.indexOf(' id')) : convertedStr;
};

function groupMessages(url, details) {
    let messages = [];

    details.map(({ message, path, context }) => {
        const { key: contextKey, label: contextLabel } = context;
        const { label } = context;
        let messageLabel = null;
        let replaceLabel = '';

        // If nested object, get parent object's name and convert it.
        if (path.length > 1) {
            messageLabel = label;
            replaceLabel = convertContextKey(contextKey);
        }
        // Else, convert the "key" into title case.
        else {
            messageLabel = _.startCase(convertContextKey(contextKey));
        }

        const inMessages = messages.find(({ key }) => {
            return _.isEqual(key, contextLabel);
        });

        // Append a whitespace if the replaceLabel is not empty.
        replaceLabel = !_.isEmpty(replaceLabel) ? replaceLabel + ' ' : replaceLabel;

        if (!inMessages) {
            const obj = {
                key: contextLabel,
                label: messageLabel,
                errors: [
                    message.replace('"' + label + '" ', replaceLabel)
                ]
            };
            messages.push(obj);
        }
        else {
            inMessages.errors.push(message.replace('"' + label + '" ', replaceLabel));
        }
    });

    // Consolidate the error messages into 1 message per path.
    messages.map(message => {
        const { label, errors } = message;

        let consolidated = '';

        if (errors.length === 1) {
            consolidated = label + ' ' + errors[0];
        }
        else if (errors.length === 2) {
            consolidated = label + ' ' + _.join(errors, ' and ');
        }
        else {
            let index = 0;

            consolidated = label;

            while (index <= errors.length - 1) {
                const delimiter = (index === errors.length - 1) ? ' and ' : (index > 0) ? ', ' : ' ';

                consolidated += delimiter + errors[index];

                index++;
            }

        }
        message.consolidated = consolidated + '.';
        return message;
    });

    return messages;
}

const schemaValidator = (schema, property = 'body') => {
    return (req, res, next) => {
        const { url } = req;
        const body = req[property];

        try {
            const { error } = schema.validate(body, _validationOptions);
            const valid = error == null;
            
            if (valid) {
                next();
            } else {
                const { details } = error;
                const messages = groupMessages(url, details);
                const message = messages.map(({ consolidated }) => ({
                    message: consolidated
                }));

                logger.error(`Failed to validate schema for ${url}. Caused by: ${error.message}`);
                logger.error(`Failed to validate schema for ${url}. Request body: ${JSON.stringify(body)}`);

                next(Errors.UnprocessableEntity(message));
            }
        } catch (error) {
            logger.error(`Failed to validate schema for ${url}. Caused by: ${error.message}`);
            logger.error(`Failed to validate schema for ${url}. Request body: ${JSON.stringify(body)}`);
            throw new Errors.InternalServerError(`Failed to validate schema for ${url}. Caused by: ${error.message}`);
        }
    }
}
module.exports = schemaValidator;
