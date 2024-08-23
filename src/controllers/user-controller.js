const {StatusCodes}=require('http-status-codes');
const {UserService}=require('../services');
const {SuccessResponse,ErrorResponse} = require('../utils/common');



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

module.exports={
    signup,
    signin
}
