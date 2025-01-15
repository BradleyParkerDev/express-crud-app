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
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const appName = process.env.APP_NAME;
// AWS
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3Client = new client_s3_1.S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});
const uploadToS3 = (file, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: `${appName}/userId1/images/${(0, uuid_1.v4)()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    const command = new client_s3_1.PutObjectCommand(params);
    // AWS recommended code
    try {
        const response = yield s3Client.send(command);
        console.log(response);
        return response;
    }
    catch (caught) {
        if (caught instanceof client_s3_1.S3ServiceException &&
            caught.name === "EntityTooLarge") {
            console.error(`Error from S3 while uploading object to ${bucketName}. \
            The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
            or the multipart upload API (5TB max).`);
        }
        else if (caught instanceof client_s3_1.S3ServiceException) {
            console.error(`Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`);
        }
        else {
            throw caught;
        }
    }
});
exports.default = uploadToS3;
