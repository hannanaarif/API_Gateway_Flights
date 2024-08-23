const express=require('express');
const {InfoController}=require('../../controllers');
const userRouter=require('./user-routes');
const router=express.Router();

console.log("Reached V1");


router.get('/info',InfoController.info);
router.use('/user',userRouter);

module.exports=router;