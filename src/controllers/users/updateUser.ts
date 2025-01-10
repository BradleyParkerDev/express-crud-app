import { Request, Response } from 'express';
import User from '../../database/schemas/Users';
import { eq } from 'drizzle-orm';
import { auth } from '../../lib/auth';
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const updateUser = async (req: Request, res: Response): Promise<void> => {

    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;

    // Dynamically assign the database 
    const db = useNeon ? neonDb : localDb;

    try {

        
        // Ensure req.decoded is set by the authorizeUser middleware
        const userId = req.body.decoded?.userId;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing from request!" });
        }
        
        const userToUpdate = req.body

        if(req.body.currentPassword){

            const currentPassword = req.body.currentPassword;
            const newPassword = req.body.newPassword;


            // Find the user - it returns an array
            const foundUserArr = await db.select().from(User).where(eq(User.userId, userId));

            if (foundUserArr.length === 0) {
                res.status(404).json({ success: false, message: "User not found" });
            }
            // First user in array
            const foundUser = {
                password: foundUserArr[0].password
            }

            const currentPasswordValid = await auth.validatePassword(currentPassword, foundUser.password)

            if(currentPasswordValid && newPassword){

                const userToUpdate = req.body
                // hash password if in req.body
                if(newPassword){
                    const saltRounds = 5;
                    const passwordHash = await auth.generatePasswordHash(newPassword, saltRounds)
                    userToUpdate.password = passwordHash;
                    console.log(userToUpdate)


                            // response returns as an array with an object
                    const response = await db.update(User)
                        .set(userToUpdate)
                        .where(eq(User.userId, userId))
                        .returning({ updatedUser: {...User} });
                    console.log(response)

                    // if response array length is 0, user not found
                    if (response.length === 0) {
                        res.status(404).json({ success: false, message: "User not found" });
                    }

                    const updatedUser = response[0].updatedUser
                    res.status(200).json({ success: true, message:"Successfully updated user password!", updatedUser });

                }

            }else{

                res.status(401).json({ message: "Current password does not match password in database!" });

            }

        }else{

            const userToUpdate = req.body

            if(!userToUpdate.password){

                // response returns as an array with an object
                const response = await db.update(User)
                    .set(userToUpdate)
                    .where(eq(User.userId, userId))
                    .returning({ updatedUser: {...User} });

                console.log(response)

                // if response array length is 0, user not found
                if (response.length === 0) {
                    res.status(404).json({ success: false, message: "User not found" });
                }

                const updatedUser = response[0].updatedUser

                res.status(200).json({ success: true, message: 'User updated successfully.', updatedUser });

            }else{

                res.status(403).json({ message: "New password not hashed!" });


            }


        }

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Error updating user", error });
    }
}

export default updateUser;
