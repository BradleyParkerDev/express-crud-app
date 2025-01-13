import { Request, Response } from "express"
import aws from "../../lib/aws"
import Images from "../../database/schemas/Images"

const uploadUserImage = async (req: Request, res:Response):Promise<void> =>{


    const file = req.file
    const response  = await aws.uploadToS3(file)

    res.status(200).json({message:"File successfully uploaded!!!", response: {...response}})
    return;
}

export default uploadUserImage;