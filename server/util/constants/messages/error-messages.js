const ERROR_MESSAGE = {
    // EX4001001: {
    //     code: 4001001,
    //     message: 'No Information Found'
    // },
	// user
	ERR4001001: {
		code: 4001001,
		message: 'Authorization header is missing!' 
	},

	ERR4001002: {
		code: 4001002,
		message: 'Must fulfill required parameters. (first_name, last_name, username, password)' 
	},

	ERR4001003: {
		code: 4001003,
		message: 'Failed to register user.' 
	},

	ERR4001003B: {
		code: 4001003,
		message: 'Failed to register user role.' 
	},

	ERR4001004: {
		code: 4001004,
		message: 'Failed to save user details.' 
	},

	ERR4001004B: {
		code: 4001004,
		message: 'Failed to save user.' 
	},

	ERR4001004C: {
		code: 4001004,
		message: 'Failed to save user. Error in saving full name.' 
	},

	ERR4001004D: {
		code: 4001004,
		message: 'Failed to save user. Error in saving user role.' 
	},

	ERR4001004E: {
		code: 4001004,
		message: 'Error in deleting user role.' 
	},

	ERR4001004F: {
		code: 4001004,
		message: 'Error in deleting user.' 
	},

	ERR4001005: {
		code: 4001005,
		message: 'Must fill username or password.' 
	},

	ERR4001006: {
		code: 4001006,
		message: 'User does not exist.' 
	},

	ERR4001007: {
		code: 4001007,
		message: 'Please check your password.' 
	},

	ERR4001008: {
		code: 4001008,
		message: 'Please check your page and limit on query parameters.'
	},

	ERR4001009: {
		code: 4001009,
		message: 'Failed to fetch inventory item.'
	},

	ERR4001010: {
		code: 4001010,
		message: 'Failed to delete inventory item.'
	},

	ERR4001011: {
		code: 4001011,
		message: 'Product is not existing!'
	},

	ERR4001012: {
		code: 4001012,
		message: 'Failed to fetch category list.'
	},

	ERR4001013: {
		code: 4001013,
		message: 'Failed to delete inventory stocks.'
	},

	ERR4001014: {
		code: 4001014,
		message: 'Failed to fetch product item.'
	},

	ERR4001015: {
		code: 4001015,
		message: 'Failed to delete product item.'
	},

	ERR4001016: {
		code: 4001016,
		message: 'Failed to delete product item.'
	},

	ERR4001017: {
		code: 4001017,
		message: 'Failed to update inventory item on product status.'
	},

	ERR4001018: {
		code: 4001018,
		message: 'Failed to fetch discount.'
	},

	ERR4001019: {
		code: 4001019,
		message: 'Failed to delete discount.'
	},

	ERR4001020: {
		code: 4001020,
		message: 'Discount is not existing!'
	},

	ERR4001021: {
		code: 4001021,
		message: 'Failed to get user list.'
	},

	ERR4001022: {
		code: 4001022,
		message: 'Failed to delete user.'
	},

	ERR4001023: {
		code: 4001023,
		message: 'User Details is not existing!'
	},

	ERR4001024: {
		code: 4001024,
		message: 'User is not existing!'
	},

	ERR4001025: {
		code: 4001025,
		message: 'Failed to fetch role list.'
	},

	ERR40010126: {
		code: 4001026,
		message: 'Failed to fetch role.'
	},

	ERR4001027: {
		code: 4001027,
		message: 'Role is not existing!'
	},

	ERR4001028: {
		code: 4001028,
		message: 'Failed to delete role.'
	},

	ERR4001029: {
		code: 4001029,
		message: 'Failed to purchase request list.'
	},

	ERR4001030: {
		code: 4001030,
		message: 'Failed to delete purchase request.'
	},

	ERR4001031: {
		code: 4001031,
		message: 'purchase request is not existing.'
	},

	ERR4001032: {
		code: 4001032,
		message: 'Failed to delete promo.'
	},

	ERR4001033: {
		code: 4001033,
		message: 'promo is not existing.'
	},

	ERR4001034: {
		code: 4001034,
		message: 'Table is not existing.'
	},

	ERR4001035: {
		code: 4001035,
		message: 'Failed to delete Table.'
	},

	ERR4001036: {
		code: 4001036,
		message: 'Failed to fetch sales report'
	},

	ERR4001037: {
		code: 4001037,
		message: 'Order failed to save.'
	},

	ERR4001038: {
		code: 4001038,
		message: 'Order is not existing.'
	},

	ERR4001039: {
		code: 4001039,
		message: 'Failed to update order status.'
	},

	ERR4001040: {
		code: 4001040,
		message: 'Failed to update order detail status.'
	},

	ERR4001041: {
		code: 4001041,
		message: 'Failed to save order detail.'
	},

	ERR4001042: {
		code: 4001042,
		message: 'Failed to save order detail.'
	},

	ERR4001043: {
		code: 4001043,
		message: 'Failed to update order detail status.'
	},

	ERR4001044: {
		code: 4001044,
		message: 'Failed to fetch discount.'
	},

	ERR4001045: {
		code: 4001045,
		message: 'Failed to delete discount.'
	},

	ERR4001046: {
		code: 4001046,
		message: 'Discount is not existing!'
	},

	ERR4001047: {
		code: 4001047,
		message: 'Payment method is not existing!'
	},
	ERR4001048: {
		code: 4001048,
		message: 'Failed to fetch inventory report'
	},
	ERR4001049: {
		code: 4001049,
		message: 'Failed to fetch permission list.'
	},
	ERR4001050: {
		code: 4001050,
		message: 'Failed to fetch role permission list.'
	},
	ERR4001051: {
		code: 4001051,
		message: 'Failed to fetch role permission by role id.'
	},
	ERR4001052: {
		code: 4001052,
		message: 'Failed to update order payment method by transaction id.'
	},
	ERR4001053: {
		code: 4001053,
		message: 'Promo is not existing'
	},
	ERR4001054: {
		code: 4001054,
		message: 'Failed to update promo status.'
	},
	ERR4001055: {
		code: 4001055,
		message: 'Discount is not existing'
	},
	ERR4001056: {
		code: 4001056,
		message: 'Failed to update discount status.'
	},
	ERR4001057: {
		code: 4001057,
		message: 'Discount is not existing'
	},
	ERR4001058: {
		code: 4001058,
		message: 'Failed to update discount status.'
	},
	ERR4001059: {
		code: 4001059,
		message: 'Surcharge is not existing'
	},
	ERR4001060: {
		code: 4001060,
		message: 'Failed to update surcharge status.'
	},
	ERR4001061: {
		code: 4001061,
		message: 'Failed to delete order items.'
	},
	ERR4001062: {
		code: 4001062,
		message: 'Failed to delete order details.'
	},
	ERR4001063: {
		code: 4001063,
		message: 'Product has no existing stock.'
	},
	ERR4001064: {
		code: 4001064,
		message: 'Failed to fetch Audit Trail list.'
	},
	ERR4001065: {
		code: 4001065,
		message: 'Failed to fetch Audit Trail Action list.'
	},
	
}

module.exports = { ERROR_MESSAGE };