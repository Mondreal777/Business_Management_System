'use strict'
// Libraries
const _ = require('lodash');

const STATUS = {
    ACTIVE: 'A',
    PENDING: 'P',
    CANCEL: 'C',
    DELETED: 'D',
	DISABLED: 'DIS',
    FAIL: 'F',
    DONE: 'DONE',
    COMPLETE: 'COMPLETE'
}

const ACTIVE = {
    label: 'ACTIVE',
    code: 'A'
};

const PENDING = {
    label: 'PENDING',
    code: 'P',
    validStatus: []
};

const CANCEL = {
    label: 'CANCEL',
    code: 'C'
};

const DELETED = {
    label: 'DELETED',
    code: 'D'
};

const FAIL = {
    label: 'FAIL',
    code: 'F'
};

const DONE = {
    label: 'DONE',
    code: 'DONE'
};

const COMPLETE = {
    label: 'COMPLETE',
    code: 'COMPLETE'
};

const statusList = [
    ACTIVE,
    PENDING,
    CANCEL,
    DELETED,
    FAIL,
    DONE,
    COMPLETE
];

const PURCHASE_REQUEST_STATUS  = {
    PENDING: 'Pending',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    COMPLETED: 'Completed',
    IN_PROGRESS: 'In Progress',
    DELETED: 'Deleted'
}

const PRODUCT_MENU_STATUS = {
    ON_PRODUCTS: 'YES',
    NOT_ON_PRODUCTS: 'NO'
}

const getStatusCode = (label) => {
    let valueResp = null;
    _.each(statusList, (status) => {
        if (label.toLowerCase() === status.label.toLowerCase()) {
            valueResp = status.code;
            return false; // lodash break equivalent
        }
    });
    return valueResp;
};

module.exports = {
    getStatusCode,
    STATUS,
    PRODUCT_MENU_STATUS,
    PURCHASE_REQUEST_STATUS
}