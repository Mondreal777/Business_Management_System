// Libraries
const Errors = require('http-errors');
const logger = require('../../util/loggers/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const conf = require('../../config/config');
const { DEFAULTS } = require('../../util/constants/enums/default');

// Database
const registerUserQuery = require('../../db-queries/user/register-user.query');
const saveUserDetailsQuery = require('../../db-queries/user-details/save-user-details.query');
const getUserDetailsByUsernameQuery = require('../../db-queries/user-details/get-user-details-by-username.query');
const saveUserRoleQuery = require('../../db-queries/user-role/save-user-role.query');
const getUserByIdQuery = require('../../db-queries/user/get-user-by-id.query');
const saveuserQuery = require('../../db-queries/user/save-user.query');
const updateUserNameQuery = require('../../db-queries/user/update-user-name.query');
const { getUserRoleByUserId } = require('../../db-queries/user-role/get-user-role-by-user-id.query');
const { deleteUserRole } = require('../../db-queries/user-role/delete-user-role.query');
const getUserDetailsByUserIdQuery = require('../../db-queries/user-details/get-user-details-by-user-id.query');
const deleteUserByIdQuery = require('../../db-queries/user/delete-user-by-id.query');
const deleteUserDetailsByIdQuery = require('../../db-queries/user-details/delete-user-details-by-user-id.query');
// Helpers
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.registerUser = async (params) => {
    try {
        let { first_name, last_name, email, password, username, userRole: roleId, organizationId } = params;
        
        if (!(username && first_name && last_name)) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001002);
        }

        if (!password) password = DEFAULTS.PASSWORD;

        const encryptedPass = await bcrypt.hash(password, 15);

        const user = {
            username,
            encryptedPass
        }

        const userId = await registerUserQuery.saveRegisteredUser(user, STATUS.ACTIVE);

        if (!userId) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001003);
        }

        const userRoleParams = {
            userId,
            roleId,
            organizationId
        };

        const userRoleId = await saveUserRoleQuery.saveUserRole(userRoleParams);

        if (!userRoleId) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001003B);
        }

        const userDetails = {
            userId,
            ...params
        }

        const userDetailsId = await saveUserDetailsQuery.saveUserDetails(userDetails, STATUS.ACTIVE);

        if (userDetailsId.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001004)
        }

        return userDetailsId;
    } catch (err) {
        logger.error(`[registerUser] services.user.service.registerUser: Error in registering user account. \n ${err.stack}`);
		throw err;
    }
}

exports.loginUser = async (params) => {
    try {
        const { username, password } = params;
        
        if (!(username && password)) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001005);
        }

        console.log("u ::", username);
        const user = await getUserDetailsByUsernameQuery.getUserDetailsByUsername(username);
        console.log("x::", user);
        if (user.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001006);
        }
        let token = null;
        await bcrypt.compare(password, user[0].password).then((res) => {
            if (res) {
                token = jwt.sign( {
                    user_details: user[0]
                }, conf.JWT_USER.TOKEN_KEY, {
                    expiresIn: "1h",
                });
                console.log("test ;:: ", token)
            } else {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001007);
            }
        });

        const userToken = {
            token
        }

        return userToken;
    } catch (err) {
        logger.error(`[loginUser] services.user.service.loginUser: Error in logging in user account. \n ${err.stack}`);
		throw err;
    }
}

exports.updateUser = async (payload) => {
    let result = null;
	let { userDetails: userNewDetails } = payload;
    try {
        let { userId, username, lastName, firstName, userRole: roleId, organizationId, password, status, changedPass } = userNewDetails;

        const user = await getUserByIdQuery.getUserById(userId);

        if (!user.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001006);
        } else {
            if (!password) password = DEFAULTS.PASSWORD;
            const encryptedPass = await bcrypt.hash(password, 15);

            const userCreds = {
                userId,
                username,
                encryptedPass,
				changedPass
            }

            result = await saveuserQuery.saveUser(userCreds, status);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001004B);
            }

            const userDetails = {
                lastName,
                firstName,
                userId
            }

			const updateFullNameResult = await updateUserNameQuery.updateUserFullName(userDetails, STATUS.ACTIVE);

			if (!updateFullNameResult) {
				throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001004B);
			}

            const userRoleParams = {
                userId,
                roleId,
                organizationId
            };

            const userRole = await getUserRoleByUserId(userId);

			let userRoleId = null;
			if (userRole.length === 0) {
				userRoleId = await saveUserRoleQuery.saveUserRole(userRoleParams);
			} else {
				const delResult = await deleteUserRole(userId);

				if (!delResult) {
					throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001004E);
				}

				userRoleId = await saveUserRoleQuery.saveUserRole(userRoleParams);
			}
	
			if (!userRoleId) {
				throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001004D);
			}

			return { updated: true };

        }
    } catch (err) {
        logger.error(`[updateUser] services.user.service.updateUser: Error in updating user account. \n ${err.stack}`);
		throw err;
    }
}

exports.deleteUserAccount = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { userId } = params
    try {
        const userDetailsData = await getUserDetailsByUserIdQuery.getUserDetailsByUserId(userId);
        let delUser, delUserDetails, delUserRole
        if (userDetailsData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001006);
        } else {
            delUser = await deleteUserByIdQuery.deleteUserById(userId);
            delUserDetails = await deleteUserDetailsByIdQuery.deleteUserDetailsByUserId(userId);
            delUserRole = await deleteUserRole(userId);

            if (!delUser || !delUserDetails || !delUserRole) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001004F);
            }
        }

        return { delUser, delUserDetails, delUserRole }
    } catch (err) {
        logger.error(`[deleteUserAccount] services.user.service.deleteUserAccount: Error in deleting user account. \n ${err.stack}`);
		throw err;
    }
}