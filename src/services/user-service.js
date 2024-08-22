const {UserRepository}=require('../repositories');
const AppError=require('../utils/errors/app-error')
const userRepo = new UserRepository();
const {StatusCodes}=require('http-status-codes')

async function signup(data){
    console.log("Data from service",data);
    try {
        const user=await userRepo.create(data);
        return user;   
    } catch (error) {
        console.log(error);
        if(error.name==='SequelizeValidationError' ||error.name==='SequelizeUniqueConstraintError'||error.name==='SequelizeValidationError'){
            console.log("Error block of service");
            let explaination=[];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            console.log(explaination);
            throw new AppError(explaination,StatusCodes.BAD_REQUEST)
        }
        throw new AppError('Cannot Create a new User object',StatusCodes.INTERNAL_SERVER_ERROR);  
    }
}

module.exports={
    signup
}