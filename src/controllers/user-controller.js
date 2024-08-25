const {StatusCodes}=require('http-status-codes');
const {UserService}=require('../services');
const {SuccessResponse,ErrorResponse} = require('../utils/common');
const {Logger}=require('../config');
const role = require('../models/role');

/**
 * POST:/signup
 * req.body{'email:abc@mail.com','password:'1234'}
 *
 */

async function signup(req,res){
    try {
        console.log("Data from Controller",req.body.email,req.body.password);
        const user=await UserService.signup({
          email:req.body.email,
          password:req.body.password
        })
        SuccessResponse.data=user;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse)
           
    }catch (error) {
        console.log("Error from controller",error);
        ErrorResponse.error=error;
        return res.status(error.statuscode)
        .json(ErrorResponse);
    }
}

async function signin(req,res){
    try {
        console.log("Data from Controller sign in",req.body.email,req.body.password);
        Logger.info("Data from Controller sign in",{});
        const user=await UserService.signin({
          email:req.body.email,
          password:req.body.password
        })
        SuccessResponse.data=user;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse)
           
    }catch (error) {
        console.log("Error from controller",error);
        ErrorResponse.error=error;
        return res.status(error.statuscode)
        .json(ErrorResponse);
    }
}



async function addRoletoUser(req,res){
    try {
        const user=await UserService.addRoletoUser({
          role:req.body.role,
          id:req.body.id
        })
        SuccessResponse.data=user;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse)
           
    }catch (error) {
        ErrorResponse.error=error;
        return res.status(error.statuscode)
        .json(ErrorResponse);
    }
}

module.exports={
    signup,
    signin,
    addRoletoUser
}
