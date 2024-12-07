import { Response } from "express";
import setAuthCookies from "../cookies/setAuthCookies";


// parameter sessionId
const rotateRefreshToken = async (res:Response, sessionId: string) =>{

    let refreshToken:string = '';
    let accessToken:string = '';


    // delete user session

    // create an authenticated user session with same expiration time


    // generate new refresh and access tokens

    // set refresh and access token in request cookies

    setAuthCookies(res, {accessToken, refreshToken})








    return  refreshToken





}


export default rotateRefreshToken;