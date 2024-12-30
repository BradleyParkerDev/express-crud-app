// auth controller imports
import loginUser from "./auth/loginUser";
import logoutUser from "./auth/logoutUser";

// images controller imports
import deleteUserImage from "./images/deleteUserImage";
import uploadUserImage from "./images/uploadUserImage";

// users controller imports 
import registerUser from "./users/registerUser";
import getUser from "./users/getUser";
import updateUser from "./users/updateUser";
import deleteUser from "./users/deleteUser";



// export authController
export const authController = {
    loginUser,
    logoutUser
}

// export imagesController
export const imagesController = {
    deleteUserImage,
    uploadUserImage
}

// export usersController
export const usersController =  {
    registerUser,
    getUser,
    updateUser,
    deleteUser
}

