// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');

// DB Queries
const getRolePermissionListQuery = require('../../db-queries/user-role-permission/get-role-permission-list.query');
const getRolePermissionByRoleIdQuery = require('../../db-queries/user-role-permission/get-role-permission-by-id.query');
const deleteRolePermissionByRoleIdQuery = require('../../db-queries/user-role-permission/delete-role-permission-by-role-id.query');
const saveRolePermissionQuery = require('../../db-queries/user-role-permission/save-role-permission-query');

exports.getRolePermissionList = async (payload) => {
    try {
        logger.info(`[getRolePermissionList] services.rolePermission.service.getRolePermissionList - START`);
        const { id: userId } = payload;

        const rolePermissionList = await getRolePermissionListQuery.getRolePermissionList();

        if (!rolePermissionList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001050);
        }

        logger.info(`[getRolePermissionList] services.rolePermission.service.getRolePermissionList - SUCCESS`);

        return { rolePermissionList }
        
    } catch (err) {
        logger.error(`[getRolePermissionList] services.rolePermission.service.getRolePermissionList: Error in getting rolePermission list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getRolePermissionList] services.rolePermission.service.getRolePermissionList - END`);
    }
}

exports.getRolePermissionByRoleId = async (payload, params) => {
    const roleId = parseInt(params.roleId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getRolePermissionByRoleId] services.user-role-permission.service.getRolePermissionByRoleId - START`);
        let roleData = await getRolePermissionByRoleIdQuery.getRolePermissionById(roleId);

        if (!roleData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001051);
        }

        logger.info(`[getRolePermissionByRoleId] services.user-role-permission.service.getRolePermissionByRoleId - SUCCESS`);

        return { roleData: roleData[0] }

    } catch (err) {
        logger.error(`[getRolePermissionByRoleId] services.user-role-permission.service.getRolePermissionByRoleId: Error in getting role permission by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getRolePermissionByRoleId] services.user-role-permission.service.getRolePermissionByRoleId - END`);
    }
}

exports.saveRolePermission = async (roleDetails) => {
    const { roleId } = roleDetails;
    let result = null;
    try {
        logger.info(`[saveRole] services.role.service.saveRole - START`);

        let roleData = [];
        // check if data is existing
        console.log("roleId: ", isNaN(roleId));
        if (!isNaN(roleId)) {
            roleData = await getRolePermissionByRoleIdQuery.getRolePermissionById(roleId);
			console.log(roleData)
        }
        
		console.log(roleData.length)
        if (roleData.length !== 0) {
            // insert if data is existing
			const deleteRolePermission = await deleteRolePermissionByRoleIdQuery.deleteRolePermissionByRoleId(roleId);
			console.log(deleteRolePermission)
        }

		for (const permissionId of roleDetails.permissionId) {
			const roleNewDetails = {
				roleId,
				permissionId
			}
			result = await saveRolePermissionQuery.saveRolePermission(roleNewDetails);
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

exports.deleteRolePermissionById = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { roleId } = params
    let result = null;
    try {
        logger.info(`[deleteRolePermissionById] services.role.service.deleteRolePermissionById - START`);

        // check if data is existing
        let roleData = await getRolePermissionByRoleIdQuery.getRolePermissionById(roleId);
        if (!roleData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001020);
        } else {
            // delete existing data to create new one later
           result = await deleteRolePermissionByRoleIdQuery.deleteRolePermissionByRoleId(roleId);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001019)
            }
        }

        logger.info(`[deleteRolePermissionById] services.role.service.deleteRolePermissionById - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteRolePermissionById] services.role.service.deleteRolePermissionById: Error in deleting role. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteRolePermissionById] services.role.service.deleteRolePermissionById - END`);
    }
}