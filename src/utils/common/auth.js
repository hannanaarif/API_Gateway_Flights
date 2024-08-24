const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {ServerConfig}=require('../../config');

function checkPassword(plainPassword,encryptedPassword){
    try {
       return bcrypt.compareSync(plainPassword,encryptedPassword)      
    } catch (error) {
        console.log("Error from checkpassword",error); 
    }
}

function createToken(input){
    try {
        console.log("ServerConfig.JWT_EXPIRY",ServerConfig.JWT_EXPIRY);
        return jwt.sign(input,ServerConfig.JWT_SECRET,{expiresIn:ServerConfig.JWT_EXPIRY});
    } catch (error) {
        console.log(error);
        throw error  
    }  
}

function verifyToken(token){
    try {
        return jwt.verify(token,ServerConfig.JWT_SECRET);
        
    } catch (error) {
        console.log(error)
        throw error
        
    }
}


module.exports={
    checkPassword,
    createToken,
    verifyToken
}