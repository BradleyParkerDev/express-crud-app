import {
    PutObjectCommand,
    S3Client,
    S3ServiceException,
  } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY





const uploadToS3 = async (filePath:any) => {
    const client = new S3Client({});
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: secretAccessKey,
        Body: filePath,
    });


    
    // AWS recommended code
    try {
        const response = await client.send(command);
        console.log(response);
    } catch (caught) {
        if (
          caught instanceof S3ServiceException &&
          caught.name === "EntityTooLarge"
        ) {
        console.error(
            `Error from S3 while uploading object to ${bucketName}. \
            The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
            or the multipart upload API (5TB max).`,
        );
        } else if (caught instanceof S3ServiceException) {
          console.error(
            `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`,
          );
        } else {
          throw caught;
        }
    }
};


export default uploadToS3;