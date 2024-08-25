const {UserRepository,RoleRepository}=require('../repositories');
const AppError=require('../utils/errors/app-error');
const {StatusCodes}=require('http-status-codes');
const {Auth,Enums}=require('../utils/common');
const { hash } = require('bcrypt');


const userRepo = new UserRepository();
const roleRepo=new RoleRepository();

async function signup(data){
    try {
        const user=await userRepo.create(data);
        const role=await roleRepo.getUserRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
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
async function isAuthenticated(token){
        try {
            if(!token){
                throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST);
            }
            const response=Auth.verifyToken(token);
            const user=await userRepo.get(response.id);
            if(!user){
                throw new AppError('No user found',StatusCodes.BAD_REQUEST);
            }
            return user.id;

        } catch (error) {
            if(error instanceof AppError) throw error;
            if(error.name=='jsonWebTokenError'){
                throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST);
            }
            if(error.name=='TokenExpiredError'){
                throw new AppError('JWT token expired',StatusCodes.BAD_REQUEST);
            }
            console.log(error);
            throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
        }
}

async function addRoletoUser(data){
    try {
        const user=await userRepo.get(data.id);
        if(!user){
            throw new AppError('No user found',StatusCodes.BAD_REQUEST);
        }
        const role=await roleRepo.getUserRoleByName(data.role);
        if(!role){
            throw new AppError('No user found for given role',StatusCodes.BAD_REQUEST);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR); 
    }

}

async function isAdmin(id){
    try {
        const user=await userRepo.get(id);
        if(!user){
            throw new AppError('No user found',StatusCodes.BAD_REQUEST);
        }
        const adminrole=await roleRepo.getUserRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminrole){
            throw new AppError('No user found for given role',StatusCodes.BAD_REQUEST);
        }
        return user.hasRole(adminrole); 
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR); 
    }

}



module.exports={
    signup,
    signin,
    isAuthenticated,
    addRoletoUser,
    isAdmin
}