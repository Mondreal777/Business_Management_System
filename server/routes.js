// Library imports
const express = require('express');
const router = express.Router();

/**
 * Routing assignment
 * Format: const @var = require('route @file');
 */
const healthCheckRoutes = require('./routes/health-check/index.route');
const personProfileRoute = require('./routes/person-profile/index.route');
const userRouter = require('./routes/user/user.routes');
const inventoryRouter = require('./routes/inventory/inventory.routes');
const categoryRouter = require('./routes/category/category.routes');
const stocksRouter = require('./routes/stocks/stocks.routes');
const roleRouter = require('./routes/role/role.routes');
const productsRouter = require('./routes/products/products.routes');
const discountRouter = require('./routes/discount/discount.routes');
const purchaseRequestRouter = require('./routes/purchase-request/purchase-request.routes');
const userDetailsRouter = require('./routes/user-details/user-details.routes');
const promosRouter = require('./routes/promos/promos.routes');
const salesReportRouter = require('./routes/reports/sales-report.routes');
const inventoryReportRouter = require('./routes/reports/inventory-report.routes');
const tableRouter = require('./routes/table/table.routes');
const orderRouter = require('./routes/order/order.routes');
const orderDetails = require('./routes/order-details/order-details.routes');
const surchargesRouter = require('./routes/surcharges/surcharges.routes');
const paymentMethodRouter = require('./routes/payment-method/payment-method.routes');
const permissionRouter = require('./routes/permission/permission.routes');
const rolePermissionRouter = require('./routes/user-role-permission/user-role-permission.routes')
const auditTrailRouter = require('./routes/audit-trail/audit-trail.routes')

/*
 * Export Function
 * Format: @var(router);
 */
module.exports = (app) => {
    // route for oojema billing details
	healthCheckRoutes(router);
    personProfileRoute(router);
    userRouter(router);
    inventoryRouter(router);
    categoryRouter(router);
    stocksRouter(router);
    roleRouter(router);
    productsRouter(router);
    discountRouter(router);
    purchaseRequestRouter(router);
    userDetailsRouter(router);
    promosRouter(router);
    salesReportRouter(router);
	tableRouter(router);
    salesReportRouter(router);
    inventoryReportRouter(router);
    orderRouter(router);
    orderDetails(router);
    surchargesRouter(router);
    paymentMethodRouter(router);
	permissionRouter(router);
	rolePermissionRouter(router);
    auditTrailRouter(router);
    app.use('/api/v1', router);
};