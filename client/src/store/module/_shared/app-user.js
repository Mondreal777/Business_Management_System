const appUser = {
	state: {
		menuId: null,
		menuChildId: null,
		storeId: null,
		inventoryId: null,
		productId: null,
		productName: null,
		stockQuantity: null,
		stockThreshold: null,
		stockCreatedDate: null,
		stockModifiedDate: null,
		discountAndSurchargesId: null,
		promosId: null,
		openSidebar: false,
		usersId: null,
		roleId: null,
		role: '',
		purchaseRequestReferenceNo: null,
		receivingId: null,
		receivingReferenceNo: null,
		purchaseRequestId: null,
		loginDetails: {
			loginUserId: null,
			loginUserRoleId: null,
			userDetails: []
		},
		//BillOut
		receiptNo: null,
		items: [],
		discount: null,
		surcharge: null,
		totalPrice: null,
		cashTendered: null,
		change: null,
		tableId: null,
		tableNo: null,
		order: {
			tableId: null,
			orderType: null,
			orderDetails: [],
			discountType: null,
			deduction: null,
			total: null,
			specialInstructions: null,
			paymentMethod: null
		},
		orderType: null,
		cartItems: [],
		cartSubTotal: null,
		surchargeId: null,
		transactionId: null,
		receiptNumber: null,
		paymentMethodId: null,

	},
	mutations: {
		setPurchaseRequestReferenceNo(state, requestReferenceNo) {
			state.purchaseRequestReferenceNo = requestReferenceNo;
		},
		setPurchaseRequestId(state, id) {
			state.purchaseRequestId = id;
		},
		setReceivingReferenceNo(state, receivingReferenceNo) {
			state.receivingReferenceNo = receivingReferenceNo;
		},
		setReceivingId(state, id) {
			state.receivingId = id;
		},
		setLoginDetails(state, loginDetails) {
			state.loginDetails = loginDetails;
		},
		setUsersId(state, id) {
			state.usersId = id;
		},
		setRoleId(state, id) {
			state.roleId = id;
		},
		setRole(state, role) {
			state.role = role;
		},
		setMenuId(state, id){
			state.menuId = id;
		},
		setMenuChildId(state, id){
			state.menuChildId = id;
		},
		setStoreId(state, id) {
			state.storeId = id;
		},
		setInventoryId(state, id) {
			state.inventoryId = id;
		},
		setProductId(state, id) {
			state.productId = id;
		},
		setProductName(state, productName) {
			state.productName = productName;
		},
		setStockQuantity(state, stockQuantity) {
			state.stockQuantity = stockQuantity;
		},
		setStockThreshold(state, stockThreshold) {
			state.stockThreshold = stockThreshold;
		},
		setStockCreatedDate(state, stockCreatedDate) {
			state.stockCreatedDate = stockCreatedDate;
		},
		setStockModifiedDate(state, stockModifiedDate) {
			state.stockModifiedDate = stockModifiedDate;
		},
		setDiscountAndSurchargesId(state, id) {
			state.discountAndSurchargesId = id;
		},
		setPromosId(state, id) {
			state.promosId = id;
		},
		//Sidebar Mutations
		setOpenSidebar(state, open) {
			state.openSidebar = open;
		},
		//Sidebar Mutations
		setOpenSidebar(state, open) {
			state.openSidebar = open;
		},
		//Sidebar Mutations
		setOpenSidebar(state, open) {
			state.openSidebar = open;
		},
		//BillOut Mutations
		setReceiptNo(state, receiptNo) {
			state.receiptNo = receiptNo;
		},
		setItems(state, items) {
			state.items = items;
		},
		setDiscount(state, discount) {
			state.discount = discount;
		},
		setSurcharge(state, surcharge) {
			state.surcharge = surcharge;
		},
		setTotalPrice(state, totalPrice) {
			state.totalPrice = totalPrice;
		},
		setCashTendered(state, cashTendered) {
			state.cashTendered = cashTendered;
		},
		setChange(state, change) {
			state.change = change;
		},
		setTableId(state, tableId) {
			state.tableId = tableId;
		},
		setTableNo(state, tableNo) {
			state.tableNo = tableNo;
		},
		setOrder(state, order) {
			state.order = order;
		},
		setOrderType(state, orderType) {
			state.orderType = orderType;
		},
		setCartItems(state, cart) {
			state.cartItems = cart;
		},
		setCartSubTotal(state, subtotal) {
			state.cartSubTotal = subtotal;
		},
		setSurchargeId(state, id) {
			state.surchargeId = id;
		},
		clearCart(state) {
			state.cartItems = [];
		},
		setTransactionId(state, id) {
			state.transactionId = id;
		},
		setReceiptNumber(state, id) {
			state.receiptNumber = id;
		},
		setPaymentMethodId(state, id) {
			state.paymentMethodId = id;
		}
		
		
	},
	actions: {

	},
	getters: {
		getLoginDetails(state) {
			return state.loginDetails;
		},
		getMenuId(state) {
			return state.menuId;
		},
		getMenuChildId(state) {
			return state.menuChildId;
    	},
		getPurchaseRequestReferenceNo(state) {
			return state.purchaseRequestReferenceNo;
		},
		getPurchaseRequestId(state) {
			return state.purchaseRequestId;
		},
		getReceivingReferenceNo(state) {
			return state.receivingReferenceNo;
		},
		getReceivingId(state) {
			return state.receivingId;
		},
		getStoreId(state) {
			return state.storeId;
		},
		getInventoryId(state) {
			return state.inventoryId;
		},
		getProductId(state) {
			return state.productId;
		},
		getProductName(state) {
			return state.productName;
		},
		getStockQuantity(state) {
			return state.stockQuantity;
		},
		getStockThreshold(state) {
			return state.stockThreshold;
		},
		getStockCreatedDate(state) {
			return state.stockCreatedDate;
		},
		getStockModifiedDate(state) {
			return state.stockModifiedDate;
		},
		getDiscountAndSurchargesId(state) {
			return state.discountAndSurchargesId;
		},
		getPromosId(state) {
			return state.promosId;
		},
		getOpenSidebar(state) {
			return state.openSidebar;
		},
		getUsersId(state){
			return state.usersId;
		},
		getRoleId(state){
			return state.roleId;
		},
		getRole(state){
			return state.role;
		},
		//Sidebar Getters
		getOpenSidebar(state) {
			return state.openSidebar;
		},
		//BillOut Getters
		getReceiptNo(state) {
			return state.receiptNo;
		},
		getItems(state) {
			return state.items;
		},
		getDiscount(state) {
			return state.discount;
		},
		getSurcharge(state) {
			return state.surcharge;
		},
		getTotalPrice(state) {
			return state.totalPrice;
		},
		getCashTendered(state) {
			return state.cashTendered;
		},
		getChange(state) {
			return state.change;
		},
		getTableId(state) {
			return state.tableId;
		},
		getTableNo(state) {
			return state.tableNo;
		},
		getOrder(state) {
			return state.order
		},
		getOrderType(state) {
			return state.orderType;
		},
		getCartItems(state) {
			return state.cartItems
		},
		getCartSubTotal(state) {
			return state.cartSubTotal
		},
		getSurchargeId(state){
			return state.surchargeId;
		},
		getTransactionId(state){
			return state.transactionId;
		},
		getReceiptNumber(state){
			return state.receiptNumber;
		},
		getPaymentMethodId(state){
			return state.paymentMethodId;
		},
		
	}
}

export default appUser;