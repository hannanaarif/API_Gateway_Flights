const {UserRepository}=require('../repositories');
const AppError=require('../utils/errors/app-error');
const userRepo = new UserRepository();
const {StatusCodes}=require('http-status-codes');
const {Auth}=require('../utils/common');

async function signup(data){
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
async function signin(data){
    try {
        const user=await userRepo.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user found for the given email',StatusCodes.NOT_FOUND);
        }
        const passwordMatch=Auth.checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('Invalid Password',StatusCodes.BAD_REQUEST);
        }
        const jwt=Auth.createToken({id:user.id,email:user.email});
        return jwt;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports={
    signup,
    signin
}