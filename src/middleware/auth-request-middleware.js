const {StatusCodes}=require('http-status-codes');
const {SuccessResponse,ErrorResponse}=require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {UserService}=require('../services');
const { response } = require('express');

function validateAuthRequest(req,res,next){
    if(!req.body.email){
        ErrorResponse.message='Something went wrong while authenticating user';
        ErrorResponse.error=new AppError(['Email not found in the comming request',StatusCodes.BAD_REQUEST]);
        return res
                 .status(StatusCodes.BAD_REQUEST)
                 .json(ErrorResponse);
    }
    if(!req.body.password){
        ErrorResponse.message='Something went wrong while authenticating user';
        ErrorResponse.error=new AppError(['password not found in the comming request',StatusCodes.BAD_REQUEST]);
        return res
                 .status(StatusCodes.BAD_REQUEST)
                 .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req,res,next){
    try {
        const response=await UserService.isAuthenticated(req.headers['x-access-token']);
        if(response){
            req.user=response  //setting the user id in the req object
            next()
        }

    } catch (error) {
        return res
                 .status(error.statuscode)
                 .json(error);
        
    }

    
}


module.exports={
    validateAuthRequest,
    checkAuth
}