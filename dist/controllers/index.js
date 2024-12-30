"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = exports.imagesController = exports.authController = void 0;
// auth controller imports
const loginUser_1 = __importDefault(require("./auth/loginUser"));
const logoutUser_1 = __importDefault(require("./auth/logoutUser"));
// images controller imports
const deleteUserImage_1 = __importDefault(require("./images/deleteUserImage"));
const uploadUserImage_1 = __importDefault(require("./images/uploadUserImage"));
// users controller imports 
const registerUser_1 = __importDefault(require("./users/registerUser"));
const getUser_1 = __importDefault(require("./users/getUser"));
const updateUser_1 = __importDefault(require("./users/updateUser"));
const deleteUser_1 = __importDefault(require("./users/deleteUser"));
// export authController
exports.authController = {
    loginUser: loginUser_1.default,
    logoutUser: logoutUser_1.default
};
// export imagesController
exports.imagesController = {
    deleteUserImage: deleteUserImage_1.default,
    uploadUserImage: uploadUserImage_1.default
};
// export usersController
exports.usersController = {
    registerUser: registerUser_1.default,
    getUser: getUser_1.default,
    updateUser: updateUser_1.default,
    deleteUser: deleteUser_1.default
};
