"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const book_route_1 = require("../modules/book/book.route");
const cart_route_1 = require("../modules/cart/cart.route");
const author_route_1 = require("../modules/author/author.route");
const wishBook_route_1 = require("../modules/wishBook/wishBook.route");
const coupon_route_1 = require("../modules/coupon/coupon.route");
const order_route_1 = require("../modules/order/order.route");
const user_route_1 = require("../modules/user/user.route");
const notification_route_1 = require("../modules/notification/notification.route");
const review_route_1 = require("../modules/review/review.route");
const payment_route_1 = require("../modules/payment/payment.route");
const category_route_1 = require("../modules/category/category.route");
const overview_route_1 = require("../modules/overview/overview.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        router: auth_route_1.AuthRouter,
    },
    {
        path: '/users',
        router: user_route_1.UserRouter,
    },
    {
        path: '/books',
        router: book_route_1.BookRouter,
    },
    {
        path: '/categories',
        router: category_route_1.CategoryRouter,
    },
    {
        path: '/authors',
        router: author_route_1.AuthorRouter,
    },
    {
        path: '/carts',
        router: cart_route_1.CartRouter,
    },
    {
        path: '/wish-books',
        router: wishBook_route_1.WishBookRouter,
    },
    {
        path: '/coupons',
        router: coupon_route_1.CouponRouter,
    },
    {
        path: '/orders',
        router: order_route_1.OrderRouter,
    },
    {
        path: '/reviews',
        router: review_route_1.ReviewRouter,
    },
    {
        path: '/notifications',
        router: notification_route_1.NotificationRouter,
    },
    {
        path: '/payments',
        router: payment_route_1.PaymentRouter,
    },
    {
        path: '/overview',
        router: overview_route_1.OverviewRouter
    }
];
const routes = moduleRoutes.map((route) => router.use(route.path, route.router));
exports.default = routes;
