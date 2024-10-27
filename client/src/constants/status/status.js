'use strict'
// Libraries
const _ = require('lodash');

const STATUS = {
    ACTIVE: 'A',
    PENDING: 'P',
    CANCEL: 'C',
    DELETED: 'D',
    FAIL: 'F',
    DONE: 'DONE',
    IN_P: 'IN PROGRESS',
    COMPLETE: 'CO'
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
    code: 'CO'
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

const PRODUCT_MENU_STATUS = {
    ON_PRODUCTS: 'YES',
    NOT_ON_PRODUCTS: 'NO'
}

const getStatusLabel = (code) => {
    let valueResp = null;
    _.each(statusList, (status) => {
        if (code.toLowerCase() === status.code.toLowerCase()) {
            valueResp = status.label;
            return false; // lodash break equivalent
        }
    });
    return valueResp;
};

module.exports = {
    getStatusLabel,
    STATUS,
    PRODUCT_MENU_STATUS
}