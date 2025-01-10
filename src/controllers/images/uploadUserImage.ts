import { Request, Response } from "express"
import dotenv from 'dotenv'
import multer from "multer"
import aws from "../../lib/aws"
import Images from "../../database/schemas/Images"

// Load environment variables
dotenv.config()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadUserImage = async (req: Request, res:Response):Promise<void> =>{


    return;
}

export default uploadUserImage;