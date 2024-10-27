import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store';
//Dashboard
const DashboardContainer = () => import(/*webpackChunkName: "dashboard" */ '@/views/main/dashboard/container/dashboard-container.vue');
// Ordering Container
const OrderingContainer = () => import(/*webpackChunkName: "ordering" */ '@/views/main/ordering/container/ordering-container.vue');
const OrderingMenuContainer = () => import(/*webpackChunkName: "orderingMenu" */ '@/views/main/ordering/container/ordering-menu-container.vue');
const OrderingCheckoutContainer = () => import(/*webpackChunkName: "orderingCheckout" */ '@/views/main/ordering/container/ordering-checkout-container.vue');
const OrderingCompleteContainer = () => import(/*webpackChunkName: "orderingComplete" */ '@/views/main/ordering/container/ordering-complete-container.vue');
const OrderingPaymentContainer = () => import(/*webpackChunkName: "orderingPayment" */ '@/views/main/ordering/container/ordering-payment-container.vue');
// Login Container
const LoginContainer = () => import(/*webpackChunkName: "login" */ '@/views/main/login/container/login-container.vue');
// New user change password
const NewUserChangePasswordContainer = () => import(/*webpackChunkName: "login" */ '@/views/main/change-password/container/change-password-container.vue');
// forgot password
const forgotPasswordContainer = () => import(/*webpackChunkName: "login" */ '@/views/main/forgot-password/container/forgot-password-container.vue');
// POS Container
const POSContainer = () => import(/*webpackChunkName: "pos" */ '@/views/main/pos/container/pos-container.vue');
const POSBillOutContainer = () => import(/*webpackChunkName: "posBillOut" */ '@/views/main/pos/container/pos-billout-container.vue');
const POSConfirmPaymentContainer = () => import(/*webpackChunkName: "POSConfirmPayment" */ '@/views/main/pos/container/pos-confirm-payment-container.vue');
//Inventory Container
const InventoryContainer = () => import(/*webpackChunkName: "inventory" */ '@/views/main/inventory/container/inventory-container.vue');
const InventoryAddContainer = () => import(/*webpackChunkName: "inventoryAdd" */ '@/views/main/inventory/container/inventory-add-container.vue');
const InventoryEditContainer = () => import(/*webpackChunkName: "inventoryEdit" */ '@/views/main/inventory/container/inventory-edit-container.vue');
//Product Container
const ProductContainer = () => import(/*webpackChunkName: "product" */ '@/views/main/product/container/product-container.vue');
const ProductAddContainer = () => import(/*webpackChunkName: "productAdd" */ '@/views/main/product/container/product-add-container.vue');
const ProductEditContainer = () => import(/*webpackChunkName: "productEdit" */ '@/views/main/product/container/product-edit-container.vue');
//Store table Container
const StoreTableContainer = () => import(/*webpackChunkName: "storeTable" */ '@/views/main/store-management/container/store-table/store-table-container.vue');
const StoreTableAddContainer = () => import(/*webpackChunkName: "storeTableAdd" */ '@/views/main/store-management/container/store-table/store-table-add-container.vue');
const StoreTableEditContainer = () => import(/*webpackChunkName: "storeTableEdit" */ '@/views/main/store-management/container/store-table/store-table-edit-container.vue');
const StorePrintEditContainer = () => import(/*webpackChunkName: "storeTablePrint" */ '@/views/main/store-management/container/store-table/store-table-print-container.vue');
//Discount Container
const discountContainer = () => import(/*webpackChunkName: "discount" */ '@/views/main/store-management/container/discount/discount-container.vue');
const discountAddContainer = () => import(/*webpackChunkName: "discountAdd" */ '@/views/main/store-management/container/discount/discount-add-container.vue');
const discountEditContainer = () => import(/*webpackChunkName: "discountEdit" */ '@/views/main/store-management/container/discount/discount-edit-container.vue');
//Surcharges Container
const surchargeContainer = () => import(/*webpackChunkName: "surcharge" */ '@/views/main/store-management/container/surcharge/surcharge-container.vue');
const surchargeAddContainer = () => import(/*webpackChunkName: "surchargeAdd" */ '@/views/main/store-management/container/surcharge/surcharge-add-container.vue');
const surchargeEditContainer = () => import(/*webpackChunkName: "surchargeEdit" */ '@/views/main/store-management/container/surcharge/surcharge-edit-container.vue');
//Promos Container
const promosContainer = () => import(/*webpackChunkName: "promos" */ '@/views/main/store-management/container/promos/promos-container.vue');
const promosAddContainer = () => import(/*webpackChunkName: "Addpromo" */ '@/views/main/store-management/container/promos/promos-add-container.vue');
const promosEditContainer = () => import(/*webpackChunkName: "promosEdit" */ '@/views/main/store-management/container/promos/promos-edit-container.vue');
//Product Container
const PurchasingContainer = () => import(/*webpackChunkName: "purchasing" */ '@/views/main/purchasing/container/purchasing-container.vue');
const PurchasingAddContainer = () => import(/*webpackChunkName: "purchasingAdd" */ '@/views/main/purchasing/container/purchasing-add-container.vue');
const PurchasingEditContainer = () => import(/*webpackChunkName: "purchasingEdit" */ '@/views/main/purchasing/container/purchasing-edit-container.vue');
const PurchasingPrintContainer = () => import(/*webpackChunkName: "purchasingPrint" */ '@/views/main/purchasing/container/purchasing-print-container.vue');
const PurchasingDownloadContainer = () => import(/*webpackChunkName: "purchasingDownload" */ '@/views/main/purchasing/container/purchasing-download-container.vue');
const ReceivingContainer = () => import(/*webpackChunkName: "receving" */ '@/views/main/purchasing/container/purchasing-receiving-container.vue');
const EditReceivingContainer = () => import(/*webpackChunkName: "editReceving" */ '@/views/main/purchasing/container/edit-purchasing-receiving-container.vue');
const ViewReceivingContainer = () => import(/*webpackChunkName: "viewReceving" */ '@/views/main/purchasing/container/view-purchasing-receiving-container.vue');
const PrintReceivingContainer = () => import(/*webpackChunkName: "printReceving" */ '@/views/main/purchasing/container/print-purchasing-receiving-container.vue');

//Users Container
const usersContainer = () => import(/*webpackChunkName: "users" */ '@/views/main/users/container/users-container.vue');
const usersAddContainer = () => import(/*webpackChunkName: "usersAdd" */ '@/views/main/users/container/users-add-container.vue');
const usersEditContainer = () => import(/*webpackChunkName: "usersEdit" */ '@/views/main/users/container/users-edit-container.vue');
//Users Container
const userRolesContainer = () => import(/*webpackChunkName: "users" */ '@/views/main/users/container/user-roles/user-roles-container.vue');
const userRolesAddContainer = () => import(/*webpackChunkName: "usersAdd" */ '@/views/main/users/container/user-roles/user-roles-add-container.vue');
const userRolesEditContainer = () => import(/*webpackChunkName: "usersEdit" */ '@/views/main/users/container/user-roles/user-roles-edit-container.vue');
//Reports Container
const salesReportsContainer = () => import(/*webpackChunkName: "salesReports" */ '@/views/main/reports/container/sales/reports-sales-container.vue');
const salesReportsPrintContainer = () => import(/*webpackChunkName: "salesReportsPrint" */ '@/views/main/reports/container/sales/reports-sales-print-container.vue');
const salesReportsDownloadContainer = () => import(/*webpackChunkName: "salesReportsDownload" */ '@/views/main/reports/container/sales/reports-sales-download-container.vue');
const inventoryReportsContainer = () => import(/*webpackChunkName: "inventoryReports" */ '@/views/main/reports/container/inventory/reports-inventory-container.vue');
const inventoryReportsPrintContainer = () => import(/*webpackChunkName: "inventoryReportsPrint" */ '@/views/main/reports/container/inventory/reports-inventory-print-container.vue');
const inventoryReportsDownloadContainer = () => import(/*webpackChunkName: "inventoryReportsDownload" */ '@/views/main/reports/container/inventory/reports-inventory-download-container.vue');

//audit Trail Container
const auditTrailContainer = () => import(/*webpackChunkName: "auditTrail" */ '@/views/main/audit-trail/container/audit-trail.container.vue');

const rootTitle = 'Online POS';

Vue.use(VueRouter);

const routes = [
  //Dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardContainer,
    meta: {
      title: `${rootTitle} - Dashboard`,
      page: 'Dashboard',
      isAuthRequired: null ,
      isGloballyAccessible: true
    }
  },
  //Ordering Views
  {
    path: '/order/:tableId',
    name: 'Ordering',
    component: OrderingContainer,
    meta: {
      title: `${rootTitle} - Ordering`,
      page: 'Ordering',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/order/:tableId/menu',
    name: 'Ordering Menu',
    component: OrderingMenuContainer,
    meta: {
      title: `${rootTitle} - Ordering Menu`,
      page: 'Ordering Menu',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/order/:tableId/checkout',
    name: 'Ordering Checkout',
    component: OrderingCheckoutContainer,
    meta: {
      title: `${rootTitle} - Ordering Checkout`,
      page: 'Ordering Checkout',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/order/:tableId/complete',
    name: 'Ordering Complete',
    component: OrderingCompleteContainer,
    meta: {
      title: `${rootTitle} - Ordering Complete`,
      page: 'Ordering Complete',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/order/:tableId/payment',
    name: 'Ordering Payment',
    component: OrderingPaymentContainer,
    meta: {
      title: `${rootTitle} - Ordering Payment`,
      page: 'Ordering Payment',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  //Login Views
  {
    path: '/',
    name: 'Login',
    component: LoginContainer,
    meta: {
      title: `${rootTitle} - Login`,
      page: 'Login',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  // New user change password
  {
	path: '/new-user-change-password',
	name: 'Change Password',
	component: NewUserChangePasswordContainer,
	meta: {
		title: `${rootTitle} - Change Password`,
		page: 'Dashboard',
		isAuthRequired: null,
		isGloballyAccessible: true
	  }
  },
  // Forgot password
  {
	path: '/forgot-password',
	name: 'Forgot Password',
	component: forgotPasswordContainer,
	meta: {
		title: `${rootTitle} - Forgot Password`,
		page: 'Dashboard',
		isAuthRequired: null,
		isGloballyAccessible: true
	  }
  },
  //POS Views
  {
    path: '/pos',
    name: 'POS',
    component: POSContainer,
    meta: {
      title: `${rootTitle} - POS`,
      page: 'POS',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/pos/billout',
    name: 'POS Bill Out',
    component: POSBillOutContainer,
    meta: {
      title: `${rootTitle} - POS Bill Out`,
      page: 'POS',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/pos/confirm-payment',
    name: 'POS Confirm Payment',
    component: POSConfirmPaymentContainer,
    meta: {
      title: `${rootTitle} - POS Confirm Payment`,
      page: 'POS',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  //Inventory Views
  {
    path: '/inventory',
    name: 'Inventory',
    component: InventoryContainer,
    meta: {
      title: `${rootTitle} - Inventory`,
      page: 'Inventory',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  }, 
  {
    path: '/inventory/add',
    name: 'Add Inventory',
    component: InventoryAddContainer,
    meta: {
      title: `${rootTitle} - Add Inventory`,
      page: 'Add Inventory',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  }, 
  {
    path: '/inventory/edit-item/:product_no',
    name: 'Edit Inventory',
    component: InventoryEditContainer,
    meta: {
      title: `${rootTitle} - Edit Inventory`,
      page: 'Edit Inventory',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  //Product Views 
  {
    path: '/products',
    name: 'Product',
    component: ProductContainer,
    meta: {
      title: `${rootTitle} - Product`,
      page: 'Product',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  }, 
  {
    path: '/products/add',
    name: 'Add Product',
    component: ProductAddContainer,
    meta: {
      title: `${rootTitle} - Add Product`,
      page: 'Add Product',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  }, 
  {
    path: '/products/edit/:product_no',
    name: 'Edit Product',
    component: ProductEditContainer,
    meta: {
      title: `${rootTitle} - Edit Product`,
      page: 'EditProduct',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  //Store table Views
  {
    path: '/store-management/tables',
    name: 'Tables',
    component: StoreTableContainer,
    meta: {
      title: `${rootTitle} - Tables`,
      page: 'Tables',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/tables/add',
    name: 'Add Table',
    component: StoreTableAddContainer,
    meta: {
      title: `${rootTitle} - Add Table`,
      page: 'Add Table',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/tables/edit',
    name: 'Edit Table',
    component: StoreTableEditContainer,
    meta: {
      title: `${rootTitle} - Edit Table`,
      page: 'Edit Table',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/tables/print',
    name: 'Print Table',
    component: StorePrintEditContainer,
    meta: {
      title: `${rootTitle} - Print Table`,
      page: 'Print Table',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  //Discount Views
  {
    path: '/store-management/discounts',
    name: 'Discount',
    component: discountContainer,
    meta: {
      title: `${rootTitle} - Discount`,
      page: 'Discount',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/discounts/add',
    name: 'Add Discount',
    component: discountAddContainer,
    meta: {
      title: `${rootTitle} - Add Discount`,
      page: 'Add Discount',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/discounts/edit/',
    name: 'Edit Discount',
    component: discountEditContainer,
    meta: {
      title: `${rootTitle} - Edit Discount`,
      page: 'Edit Discount',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  //Surcharge Views
  {
    path: '/store-management/surcharges',
    name: 'Surcharge',
    component: surchargeContainer,
    meta: {
      title: `${rootTitle} - Surcharge`,
      page: 'Surcharge',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/surcharges/add',
    name: 'Add Surcharge',
    component: surchargeAddContainer,
    meta: {
      title: `${rootTitle} - Add Surcharge`,
      page: 'Add Surcharge',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/surcharges/edit/',
    name: 'Edit Surcharge',
    component: surchargeEditContainer,
    meta: {
      title: `${rootTitle} - Edit Surcharge`,
      page: 'Edit Surcharge',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  //Promos Views
  {
    path: '/store-management/promos',
    name: 'Promos',
    component: promosContainer,
    meta: {
      title: `${rootTitle} - Promos`,
      page: 'Promos',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/promos/add',
    name: 'Add Promos',
    component: promosAddContainer,
    meta: {
      title: `${rootTitle} - Add Promos`,
      page: 'Add Promos',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  {
    path: '/store-management/promos/edit',
    name: 'Edit Promos',
    component: promosEditContainer,
    meta: {
      title: `${rootTitle} - Edit Promos`,
      page: 'Edit Promos',
      isAuthRequired: null,
      isGloballyAccessible: false
    }
  },
  //Users Views 
  {
    path: '/user-management/users',
    name: 'Users',
    component: usersContainer,
    meta: {
      title: `${rootTitle} - users`,
      page: 'Users',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/user-management/users/add',
    name: 'Add Users',
    component: usersAddContainer,
    meta: {
      title: `${rootTitle} - Add Users`,
      page: 'Add Users',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/user-management/users/edit',
    name: 'Edit Users',
    component: usersEditContainer,
    meta: {
      title: `${rootTitle} - Edit Users`,
      page: 'Edit Users',
    }
  },
  //User roles Views 
  {
    path: '/user-management/user-roles',
    name: 'User Roles',
    component: userRolesContainer,
    meta: {
      title: `${rootTitle} - User Roles`,
      page: 'User Roles',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/user-management/user-roles/add',
    name: 'Add User Roles',
    component: userRolesAddContainer,
    meta: {
      title: `${rootTitle} - Add User Roles`,
      page: 'Add User Roles',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/user-management/user-roles/edit',
    name: 'Edit User Roles',
    component: userRolesEditContainer,
    meta: {
      title: `${rootTitle} - Edit User Roles`,
      page: 'Edit User Roles',
    }
  },
  //Purchasing Views 
  {
    path: '/purchasing',
    name: 'Purchasing',
    component: PurchasingContainer,
    meta: {
      title: `${rootTitle} - Purchasing`,
      page: 'Purchasing',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  }, 
  {
    path: '/purchasing/add',
    name: 'Add Purchasing',
    component: PurchasingAddContainer,
    meta: {
      title: `${rootTitle} - Add Purchase`,
      page: 'Purchasing',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  }, 
  {
    path: '/purchasing/edit',
    name: 'Edit Purchasing',
    component: PurchasingEditContainer,
    meta: {
      title: `${rootTitle} - Edit Purchase`,
      page: 'Purchasing',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  }, 
  {
    path: '/purchasing/print',
    name: 'Print Purchasing',
    component: PurchasingPrintContainer,
    meta: {
      title: `${rootTitle} - print Purchase`,
      page: 'Purchasing',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/purchasing/download',
    name: 'Download Purchasing',
    component: PurchasingDownloadContainer,
    meta: {
      title: `${rootTitle} - download Purchase`,
      page: 'Purchasing',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  //Reports Views
  {
    path: '/sales-reports',
    name: 'Sales Reports',
    component: salesReportsContainer,
    meta: {
      title: `${rootTitle} - Sales Reports`,
      page: 'Sales Reports',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/inventory-reports',
    name: 'Inventory Reports',
    component: inventoryReportsContainer,
    meta: {
      title: `${rootTitle} - Inventory Reports`,
      page: 'Inventory Reports',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/sales-reports-print',
    name: 'Sales Reports Print',
    component: salesReportsPrintContainer,
    meta: {
      title: `${rootTitle} - Sales Reports Print`,
      page: 'Sales Reports Print',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/sales-reports-download',
    name: 'Sales Reports Download',
    component: salesReportsDownloadContainer,
    meta: {
      title: `${rootTitle} - Sales Reports Download`,
      page: 'Sales Reports Download',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/inventory-reports-print',
    name: 'Inventory Reports Print',
    component: inventoryReportsPrintContainer,
    meta: {
      title: `${rootTitle} - Inventory Reports Print`,
      page: 'Inventory Reports Print',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/inventory-reports-download',
    name: 'Inventory Reports Download',
    component: inventoryReportsDownloadContainer,
    meta: {
      title: `${rootTitle} - Inventory Reports Download`,
      page: 'Inventory Reports Download',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/receiving',
    name: 'Purchase Request Recieving Items',
    component: ReceivingContainer,
    meta: {
      title: `${rootTitle} - Purchase Request Recieving Items`,
      page: 'Purchase Request Recieving Items',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/receiving/edit/',
    name: 'Edit Purchase Request Recieving Items',
    component: EditReceivingContainer,
    meta: {
      title: `${rootTitle} - Edit Purchase Request Recieving Items`,
      page: 'Edit Purchase Request Recieving Items',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/receiving/print/',
    name: 'Print Purchase Request Recieving Items',
    component: PrintReceivingContainer,
    meta: {
      title: `${rootTitle} - Print Purchase Request Recieving Items`,
      page: 'Print Purchase Request Recieving Items',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/audit-trail/',
    name: 'Audit Trail',
    component: auditTrailContainer,
    meta: {
      title: `${rootTitle} - Audit Trail`,
      page: 'Audit Trail',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
  {
    path: '/receiving/view/',
    name: 'View Purchase Request Recieving Items',
    component: ViewReceivingContainer,
    meta: {
      title: `${rootTitle} - View Purchase Request Recieving Items`,
      page: 'View Purchase Request Recieving Items',
      isAuthRequired: null,
      isGloballyAccessible: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  routes,
})


export default router
