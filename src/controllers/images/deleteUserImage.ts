import { Request, Response } from "express"
import dotenv from 'dotenv'
import aws from "../../lib/aws"

// Load environment variables
dotenv.config()

const deleteUserImage = async (req: Request, res:Response):Promise<void> =>{

    return;
}

export default deleteUserImage;