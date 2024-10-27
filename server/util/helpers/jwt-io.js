// Libraries
const Errors = require('http-errors');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const jwt_decode = require('jwt-decode');

// Configs
const conf = require('../../config/config');

function getJWTFromAuthorization(authorization) {
    const parts = authorization.split(' ');

    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        const pattern = new RegExp('^Bearer$', 'i');

        if (pattern.test(scheme)) {
            // Check if the supplied header token type is valid
            return credentials;
        }
    }

    return '';
}

/**
 * This will convert the JWK to PEM format.
 * Get jwk data https://cognito-idp.<region>.amazonaws.com/<userPoolId>/.well-known/jwks.json
 * @returns pem
 */
async function formatJwkToPem() {
    const jwk = await juice.string('jwk', juice.MANDATORY);
    const pem = await jwkToPem(jwk.keys[1]);
    return pem;
}

/**
 * Compare the local key ID (kid) to the public kid
 * @param {*} token is the authentication provided by the aws cognito
 */
async function validateKid(token) {
    const jwk = await juice.string('jwk', juice.MANDATORY);
    const { kid } = await jwt_decode(token, { header: true });
    if (Object.values(jwk.keys[1]).includes(kid)) { 
        return;
    } else {
        throw new Errors.Unauthorized('Authorization token is invalid!');
    }
}

/**
 * The audience (aud) claim should match the app client ID that was created in the Amazon Cognito user pool.
 * @param {*} token is the authentication provided by the aws cognito
 */
async function validateAud(token) {
    const username = conf.JWT_USER.USERNAME;
    const { user } = await decodeJWT(token);
    if (username === user) { 
        return;
    } else {
        throw new Errors.Unauthorized('Authorization token is invalid!');
    }
}

/**
 * Validate whether the JWT from AWS Cognito is invalid or expired.
 * If invalid or expired, corresponding error status will be thrown.
 * @param {*} token is the authentication provided by the aws cognito
 */
async function validateJWT(token) {
    try {
        // Compare the local key ID (kid) to the public kid
        // await validateKid(token);
        // const pem = await formatJwkToPem();
        // Verify jwt token
        // await jwt.verify(token, pem, { algorithms: ['RS256'] });
        // The audience (aud) claim should match the app client ID that was created in the Amazon Cognito user pool.
        // await validateAud(token);
		// const { user } = await decodeJWT(token);
        const x = decodeJWT(token);
        console.log(x)
		
		if (user === conf.JWT_USER.USERNAME) {
			return
		} else {
			throw new Errors.Unauthorized('Authorization token is invalid!');
		}
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Errors.Unauthorized('Authorization token has expired!');
        } else {
            throw new Errors.Unauthorized('Authorization token is invalid!');
        }
    }
}

/**
 * Decode the jwt token
 * @param {*} token is the authentication provided by the aws cognito
 */
const decodeJWT = token => jwt.decode(token);

module.exports = { getJWTFromAuthorization, validateJWT, decodeJWT };