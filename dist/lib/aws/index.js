"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deleteFromS3_1 = __importDefault(require("./s3/deleteFromS3"));
const getFromS3_1 = __importDefault(require("./s3/getFromS3"));
const uploadToS3_1 = __importDefault(require("./s3/uploadToS3"));
const aws = {
    // Delete object from s3 bucket
    deleteFromS3: deleteFromS3_1.default,
    // Get object from s3 bucket
    getFromS3: getFromS3_1.default,
    // Upload object to s3 bucket
    uploadToS3: uploadToS3_1.default
};
exports.default = aws;
