"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const globalErrorHandler_1 = require("./Errors/globalErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/v1', routes_1.default);
app.use(globalErrorHandler_1.GlobalErrorHandler);
app.use((req, res) => {
    if (req.url === '/') {
        res.status(200).json({
            message: 'Hey welcome to  server',
        });
    }
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Not Found',
    });
});
exports.default = app;
