'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const category_model_1 = require('./category.model');
const func_1 = require('../../utils/func');
const createCategoryIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.exists({
      name: payload.name,
    });
    // Checking is the category already exists with the same name
    if (category) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Category already exists',
      );
    }
    return yield category_model_1.Category.create(payload);
  });
const getCategoriesFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield category_model_1.Category.find({ is_hidden: false });
  });
const deleteCategoryFromDB = (categoryId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const deleteStatus = yield category_model_1.Category.deleteOne({
      _id: (0, func_1.objectId)(categoryId),
    });
    if (!deleteStatus.deletedCount) {
      throw new AppError_1.default(
        http_status_1.default.BAD_REQUEST,
        'Category can not be deleted. something went wrong',
      );
    }
    return null;
  });
exports.CategoryService = {
  createCategoryIntoDB,
  getCategoriesFromDB,
  deleteCategoryFromDB,
};
