import deleteFromS3 from "./s3/deleteFromS3";
import getFromS3 from "./s3/getFromS3";
import uploadToS3 from "./s3/uploadToS3";


const aws = {
    // Delete object from s3 bucket
    deleteFromS3: deleteFromS3,

    // Get object from s3 bucket
    getFromS3: getFromS3,   

    // Upload object to s3 bucket
    uploadToS3: uploadToS3
}

export default aws;