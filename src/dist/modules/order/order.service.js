"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const func_1 = require("../../utils/func");
const book_model_1 = require("../book/book.model");
const order_model_1 = require("./order.model");
const payment_model_1 = require("../payment/payment.model");
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const paypal_1 = require("../../paymentMethods/paypal");
const coupon_model_1 = __importDefault(require("../coupon/coupon.model"));
const coupon_interface_1 = require("../coupon/coupon.interface");
const notification_service_1 = require("../notification/notification.service");
const config_1 = __importDefault(require("../../config"));
const user_interface_1 = require("../user/user.interface");
const createOrderIntoDB = (res, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bookObjectIds = payload.items.map((book) => (0, func_1.objectId)(book.bookId));
    const books = yield book_model_1.Book.find({ _id: { $in: bookObjectIds } });
    //  Checking is get all books correctly
    if (books.length !== payload.items.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    const purchasedBooks = [];
    payload.items.forEach((book) => {
        const foundedBook = books.find((dbBook) => dbBook._id.toString() === book.bookId);
        if (!foundedBook) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Book not found`);
        }
        // Checking is user demanded number of quantity books available in stock
        else if (foundedBook.available_stock < book.quantity) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Stock not available');
        }
        else if (foundedBook.is_paused || foundedBook.is_deleted) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Currently ${foundedBook.name} is not available to purchase`);
        }
        const bookData = {
            book: foundedBook._id,
            name: foundedBook.name,
            image: foundedBook.cover_images[0],
            quantity: book.quantity,
            unit_price: foundedBook.price.enable_discount_price
                ? foundedBook.price.discount_price
                : foundedBook.price,
            free_delivery: foundedBook.free_delivery || false,
        };
        purchasedBooks.push(bookData);
    });
    // Calculating total amount
    let total = 0;
    let subtotal = 0;
    let delivery_charge = 0;
    purchasedBooks.forEach((item) => {
        total += item.unit_price * item.quantity;
        subtotal += item.unit_price * item.quantity;
        // Checking is the book has free delivery service
        if (!item.free_delivery) {
            total += 3;
            delivery_charge += 3;
        }
    });
    const amount = {
        subtotal,
        delivery_charge,
        discount: 0,
        total,
    };
    if (payload.coupon) {
        const coupon = yield coupon_model_1.default.findOne({ coupon_code: payload.coupon });
        const currentDate = new Date();
        // Checking coupon existence
        if (!coupon) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
        }
        // Checking coupon apply requirements
        if (coupon.specific_customers !== '**') {
            if (!coupon.specific_customers.includes(userId)) {
                throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Coupon can not be applied');
            }
        }
        else if (coupon.applicable_categories !== '**') {
            books.forEach((book) => {
                if (!coupon.applicable_categories.includes(book.category)) {
                    throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Coupon cannot be applied on ${book.category}`);
                }
            });
        }
        // Checking coupon validity
        else if (currentDate < new Date(coupon.valid_from)) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `This coupon can not be use before ${new Date(coupon.valid_from).toDateString()}`);
        }
        // Checking coupon validity
        else if (currentDate > new Date(coupon.valid_until)) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `The coupon is expired`);
        }
        else if (coupon.minimum_purchase_amount > amount.total) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `This coupon can be applied on minimum $ ${coupon.minimum_purchase_amount} purchase`);
        }
        // Applying coupon on price based on coupon type
        if (coupon.discount_type === coupon_interface_1.TCouponDiscountType.FIXED) {
            amount.total = amount.total - coupon.discount_amount;
            amount.discount = coupon.discount_amount;
        }
        else {
            const discount = (amount.total / 100) * coupon.discount_amount;
            amount.total = amount.total - discount;
            amount.discount = discount;
        }
    }
    const paymentData = {
        transaction_id: 'PP' + crypto_1.default.randomBytes(8).toString('hex').toUpperCase(),
        payment_method: payload.payment_method,
        amount,
        coupon: payload.coupon || null,
        user: userId,
    };
    // Session for transaction and rollback
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.create([paymentData], { session: session });
        if (!payment || !payment[0]) {
            throw new Error();
        }
        const orderData = {
            items: purchasedBooks.map((book) => ({
                book: book.book,
                quantity: book.quantity,
                unit_price: book.unit_price,
            })),
            delivery_details: payload.delivery_details,
            payment: payment[0]._id,
            customer: userId,
        };
        if (payload.customer_message) {
            orderData.customer_message = payload.customer_message;
        }
        // Creating order into db
        const order = yield order_model_1.Order.create([orderData], { session });
        // Checking is the order successfully created in the database
        if (!order[0]) {
            throw new Error();
        }
        yield session.commitTransaction();
        yield session.endSession();
        yield paypal_1.Paypal.pay(res, amount.total, payment[0]._id.toString());
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(400, 'Something went wrong');
    }
});
const managePaymentSuccessOrdersIntoDB = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId);
    //  Checking payment existence
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Something went wrong');
    }
    // Updating payment success status false to true
    const updatePayment = yield payment_model_1.Payment.updateOne({ _id: payment._id }, { success: true });
    // Checking is the payment successfully updated
    if (!updatePayment.modifiedCount) {
        throw new AppError_1.default(400, 'Order unsuccessful');
    }
    // Updating order paid status
    const orderedBooks = yield order_model_1.Order.findOneAndUpdate({ payment: (0, func_1.objectId)(paymentId) }, { is_paid: true }, { new: true }).select('books');
    // Updating books available_stock
    if (orderedBooks) {
        Promise.all(orderedBooks.items.map((item) => book_model_1.Book.findByIdAndUpdate(item.book, {
            $inc: { available_stock: -item.quantity },
        })));
    }
    return true;
});
// Manage order after successful payment
const managePaypalPaymentSuccessOrdersIntoDB = (res, query) => __awaiter(void 0, void 0, void 0, function* () {
    const manageOrder = (saleId) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield payment_model_1.Payment.findById(query.orderPaymentId);
        //  Checking payment existence
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Something went wrong');
        }
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            // Updating payment success status false to true
            const updatePayment = yield payment_model_1.Payment.updateOne({ _id: payment._id }, { success: true, intent_id: saleId });
            // Checking is the payment successfully updated
            if (!updatePayment.modifiedCount) {
                throw new Error();
            }
            // Updating order paid status
            const orderedBooks = yield order_model_1.Order.findOneAndUpdate({ payment: (0, func_1.objectId)(query.orderPaymentId) }, { is_paid: true }, { new: true, session }).select('items');
            // Updating books available_stock
            if (orderedBooks) {
                yield Promise.all(orderedBooks.items.map((item) => book_model_1.Book.findByIdAndUpdate(item.book, { $inc: { available_stock: -item.quantity } }, { session }))).catch((err) => {
                    throw new Error();
                });
            }
            yield notification_service_1.NotificationService.createNotificationIntoDB({
                notification: {
                    title: 'Your order successfully placed`',
                    description: 'Thanks for your order.We will deliver your order as soon as possible',
                },
                users: [payment.user.toString()],
            });
            yield session.commitTransaction();
            session.endSession;
            res.redirect(config_1.default.order_success_url);
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            // Found an error and refund the payed amount  to payer
            paypal_1.Paypal.refund(saleId, payment.amount.subtotal, config_1.default.order_cancel_url, res);
        }
    });
    // Executing payment
    paypal_1.Paypal.executePayment(query.paymentId, query.PayerID, manageOrder);
});
// Manage order after cancel payment
const managePaymentCanceledOrderIntoDB = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield order_model_1.Order.findOneAndDelete({ payment: (0, func_1.objectId)(paymentId) });
    yield payment_model_1.Payment.findByIdAndDelete(paymentId);
});
const getOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.aggregate([
        {
            $lookup: {
                from: 'payments',
                localField: 'payment',
                foreignField: '_id',
                as: 'payments',
            },
        },
        {
            $addFields: {
                payment: {
                    $arrayElemAt: ['$payments', 0],
                },
            },
        },
        {
            $match: {
                'payment.success': true,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $limit: 5,
        },
    ]);
    return result;
});
const getCurrentUserOrdersFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const stages = [
        {
            $lookup: {
                from: 'payments',
                localField: 'payment',
                foreignField: '_id',
                as: 'payments',
            },
        },
        {
            $addFields: {
                payment: {
                    $arrayElemAt: ['$payments', 0],
                },
            },
        },
        {
            $match: {
                'payment.success': true,
                status: {
                    $in: query.status
                        ? [query.status]
                        : [
                            order_interface_1.TOrderStatus.PENDING,
                            order_interface_1.TOrderStatus.PROCESSING,
                            order_interface_1.TOrderStatus.IN_TRANSIT,
                            order_interface_1.TOrderStatus.OUT_FOR_DELIVERY,
                        ],
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ];
    const result = (yield order_model_1.Order.aggregate(stages)).map((item) => {
        delete item.payments;
        return item;
    });
    return result;
});
const updateOrderStatus = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(payload.orderId).populate('payment');
    //  Checking order existence
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    // Checking order payment status
    if (!order.payment.success) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Status can not be change of this order ');
    }
    const orderStatus = order.status;
    if (orderStatus === order_interface_1.TOrderStatus.PENDING &&
        payload.status !== order_interface_1.TOrderStatus.PROCESSING) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Order status can not be change Pending to ${payload.status}`);
    }
    else if (orderStatus === order_interface_1.TOrderStatus.PROCESSING &&
        payload.status !== order_interface_1.TOrderStatus.IN_TRANSIT) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Order status can not be change Processing to ${payload.status}`);
    }
    else if (orderStatus === order_interface_1.TOrderStatus.IN_TRANSIT &&
        payload.status !== order_interface_1.TOrderStatus.OUT_FOR_DELIVERY) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Order status can not be change InTransit to ${payload.status}`);
    }
    else if (orderStatus === order_interface_1.TOrderStatus.DELIVERED) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Delivered order status can not be update');
    }
    else if (orderStatus === order_interface_1.TOrderStatus.RETURNED) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Order status can not be change');
    }
    else if (orderStatus === order_interface_1.TOrderStatus.CANCELLED) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Order status can not be change');
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(payload.orderId, { status: payload.status }, { new: true }).select('status');
    return result;
});
const cancelOrderIntoDB = (userId, userRole, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    // Checking order existence
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    //  only admin or moderator and owner of this order can cancel it
    if (userRole === user_interface_1.TRole.CUSTOMER) {
        // One Customer can not cancel another customer order
        if (order.customer.toString() !== userId) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order can not be canceled');
        }
    }
    // Only pending order can canceled
    if (order.status !== order_interface_1.TOrderStatus.PENDING) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Order Can not be canceled now ');
    }
    // Updating order status Pending to Canceled
    const updateStatus = yield order_model_1.Order.updateOne({ _id: (0, func_1.objectId)(orderId) }, { status: order_interface_1.TOrderStatus.CANCELLED });
    // Checking is the order updated successfully
    if (!updateStatus.modifiedCount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order can not be canceled');
    }
    return null;
});
const getCustomerYetToReviewOrdersFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.aggregate([
        {
            $match: {
                customer: (0, func_1.objectId)(userId),
                status: order_interface_1.TOrderStatus.DELIVERED,
            },
        },
        {
            $unwind: '$items',
        },
        {
            $project: {
                order: '$items',
            },
        },
        {
            $match: {
                'order.is_reviewed': false,
            },
        },
        {
            $lookup: {
                from: 'books',
                localField: 'order.book',
                foreignField: '_id',
                as: 'order.book',
            },
        },
        {
            $project: {
                'order.book': {
                    _id: 1,
                    name: 1,
                    cover_images: 1,
                },
                'order.quantity': 1,
                'order.unit_price': 1,
                delivery_date: 1,
            },
        },
    ]);
    return result.map((item) => {
        // Converting book field array ro object
        item.order.book = item.order.book[0];
        return item;
    });
});
const getOrderDetailsFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = order_model_1.Order.findById(orderId).populate('payment');
    return result;
});
const getUserOrderHistoryFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const stages = [
        {
            $lookup: {
                from: 'payments',
                localField: 'payment',
                foreignField: '_id',
                as: 'payments',
            },
        },
        {
            $addFields: {
                payment: {
                    $arrayElemAt: ['$payments', 0],
                },
            },
        },
        {
            $match: {
                'payment.success': true,
                status: {
                    $in: query.status
                        ? [query.status]
                        : [
                            order_interface_1.TOrderStatus.DELIVERED,
                            order_interface_1.TOrderStatus.CANCELLED,
                            order_interface_1.TOrderStatus.RETURNED,
                        ],
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ];
    const result = (yield order_model_1.Order.aggregate(stages)).map((item) => {
        delete item.payments;
        return item;
    });
    return result;
});
exports.OrderService = {
    createOrderIntoDB,
    managePaymentSuccessOrdersIntoDB,
    managePaypalPaymentSuccessOrdersIntoDB,
    getOrdersFromDB,
    updateOrderStatus,
    managePaymentCanceledOrderIntoDB,
    getCustomerYetToReviewOrdersFromDB,
    getCurrentUserOrdersFromDB,
    getOrderDetailsFromDB,
    cancelOrderIntoDB,
    getUserOrderHistoryFromDB,
};
