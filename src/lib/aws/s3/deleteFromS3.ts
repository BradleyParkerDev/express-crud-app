import dotenv from 'dotenv';

// Load environment variables
dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const deleteFromS3 = async ()=>{




}

export default deleteFromS3;