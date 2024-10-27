// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');

// DB Queries
const getRoleListQuery = require('../../db-queries/role/get-role-list.query');
const getRoleByIdQuery = require('../../db-queries/role/get-role-by-id.query');
const saveRoleQuery = require('../../db-queries/role/save-role.query');
const updateRoleQuery = require('../../db-queries/role/update-role.query');
const deleteRoleByIdQuery = require('../../db-queries/role/delete-role-by-id.query');

exports.getRoleList = async (payload) => {
    try {
        logger.info(`[getRoleList] services.role.service.getRoleList - START`);
        const { id: userId } = payload;

        const roleList = await getRoleListQuery.getRoleList();

        if (!roleList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001025);
        }

        logger.info(`[getRoleList] services.role.service.getRoleList - SUCCESS`);

        return { roleList }
        
    } catch (err) {
        logger.error(`[getRoleList] services.role.service.getRoleList: Error in getting role list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getRoleList] services.role.service.getRoleList - END`);
    }
}

exports.getRoleById = async (payload, params) => {
    const roleId = parseInt(params.roleId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getRoleById] services.role.service.getRoleById - START`);
        let roleData = await getRoleByIdQuery.getRoleById(roleId);

        if (!roleData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR40010126)
        }

        logger.info(`[getRoleById] services.role.service.getRoleById - SUCCESS`);

        return { roleData: roleData[0] }

    } catch (err) {
        logger.error(`[getRoleById] services.role.service.getRoleById: Error in getting discount details by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getRoleById] services.role.service.getRoleById - END`);
    }
}

exports.saveRole = async (roleDetails) => {
    const { roleId } = roleDetails;
    let result = null;
    try {
        logger.info(`[saveRole] services.role.service.saveRole - START`);

        let roleData = [];
        // check if data is existing
        console.log("roleId: ", isNaN(roleId));
        if (!isNaN(roleId)) {
            roleData = await getRoleByIdQuery.getRoleById(roleId);
        }
        
        if (roleData.length === 0) {
            // insert if data is not existing
            result = await saveRoleQuery.saveRole(roleDetails);
        } else {
            // delete existing data to create new one later
            // const deletedRole = await deleteRoleByIdQuery.deleteRoleById(roleData[0].id);

            // if (!deletedRole) {
            //     throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001019);
            // }

            result = await updateRoleQuery.updateRole(roleDetails);
        }

        logger.info(`[saveRole] services.role.service.saveRole - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveRole] services.role.service.saveRole: Error in saving role details. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveRole] services.role.service.saveRole - END`);
    }
}

exports.deleteRoleById = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { id } = params
    let result = null;
    try {
        logger.info(`[deleteRoleById] services.role.service.deleteRoleById - START`);

        // check if data is existing
        let roleData = await getRoleByIdQuery.getRoleById(id);
        if (!roleData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001020);
        } else {
            // delete existing data to create new one later
           result = await deleteRoleByIdQuery.deleteRoleById(id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001019)
            }
        }

        logger.info(`[deleteRoleById] services.role.service.deleteRoleById - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteRoleById] services.role.service.deleteRoleById: Error in deleting role. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteRoleById] services.role.service.deleteRoleById - END`);
    }
}