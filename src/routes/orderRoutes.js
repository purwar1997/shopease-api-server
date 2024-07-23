import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  adminGetOrders,
  adminGetOrderById,
} from '../controllers/orderControllers.js';
import {
  createOrderSchema,
  ordersQuerySchema,
  adminOrdersQuerySchema,
  orderIdSchema,
} from '../schemas/orderSchemas.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import {
  validatePayload,
  validateQueryParams,
  validatePathParams,
} from '../middlewares/requestValidators.js';
import {
  validateProducts,
  validateCoupon,
  validateAddress,
} from '../middlewares/orderValidators.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router
  .route('/orders')
  .all(isHttpMethodAllowed, isAuthenticated)
  .get(validateQueryParams(ordersQuerySchema), getOrders)
  .post(
    validatePayload(createOrderSchema),
    validateProducts,
    validateCoupon,
    validateAddress,
    createOrder
  );

router
  .route('/orders/:orderId')
  .get(isAuthenticated, validatePathParams(orderIdSchema), getOrderById);

router
  .route('/orders/:orderId/cancel')
  .put(isAuthenticated, validatePathParams(orderIdSchema), cancelOrder);

router
  .route('/admin/orders')
  .get(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validateQueryParams(adminOrdersQuerySchema),
    adminGetOrders
  );

router
  .route('/admin/orders/:orderId')
  .all(
    isHttpMethodAllowed,
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(orderIdSchema)
  )
  .get(adminGetOrderById);

export default router;
