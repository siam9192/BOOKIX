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
exports.AuthorController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const response_1 = require("../../utils/response");
const http_status_1 = __importDefault(require("http-status"));
const author_service_1 = require("./author.service");
const createAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield author_service_1.AuthorService.createAuthorIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Author created successfully',
        data: result,
    });
}));
const getAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = req.params.authorId;
    const result = yield author_service_1.AuthorService.getAuthorFromDB(authorId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Author retrieved successfully',
        data: result,
    });
}));
const getAuthors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name;
    const result = yield author_service_1.AuthorService.getAuthorsFromDB(name);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Authors retrieved successfully',
        data: result,
    });
}));
const updateAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = req.params.authorId;
    const result = yield author_service_1.AuthorService.updateAuthorIntoDB(authorId, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Author updated successfully',
        data: result,
    });
}));
const deleteAuthor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = req.params.authorId;
    const result = yield author_service_1.AuthorService.deleteAuthorFromDB(authorId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Author deleted successfully',
        data: result,
    });
}));
exports.AuthorController = {
    createAuthor,
    getAuthor,
    getAuthors,
    updateAuthor,
    deleteAuthor,
};
