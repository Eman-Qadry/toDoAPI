const User=require('../models/user');
const path=require('path');
const fs=require('fs');
const {validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
exports.profile=(req,res,next)=>{

const userID= req.userId;
User.findById(userID).then(user=>{
    if (!req.file){
        const err= new Error('no image provided');
        err.statusCode=422;
        throw err;
    }
    if ( user.imgUrl   &&user.imgUrl !=req.file.path){
        clearimage(user.imageUrl);
    }
    if (!user){
        const err= new Error('could not find this user!');
        err.statusCode=404;
        throw err;
    }
    user.imgUrl=req.file.path;
    return user.save();
})
.then(result=>{
    if (!result){
        const err= new Error('could not save user data');
        err.statusCode=500;
        throw err;
    }
    res
    .status(200)
    .json({
        message:'profile image is updated successfully',
        userID:req.userId
    }
    )

})
.catch(err=>{
if (!err.statusCode)
    err.statusCode=500;
  next(err);
});
};

exports.editUser=(req,res,next)=>{
    try{
        const error = validationResult(req);}
        catch(err){
        console.log('crashed');
        }
    // if (!error.isEmpty()){
    //     const error =new Error('validation failed!');
    //     error.statusCode=422;
    //     error.data=error.array();
    //     throw error;
    
    // }
    const name=req.body.name;
    const age=req.body.age;
    const address=req.body.age;
    User.findById(req.userId)
    .then(user=>{
        if (name)
            user.name=name;
        if (age)
            user.age=age;
        if (address)
            user.address=address;
        return user.save();
    })
    .then (result=>{
        res
        .status(201)
        .json({
            message:'user is updated successfully',
            user:result
        })
    })
    .catch(err=>{
        if (!err.statusCode)
            err.statusCode=500;
          next(err);
        });
};

exports.editpassword=(req,res,next)=>{
    try{
        const errors = validationResult(req);}
        catch(err){
        console.log('crashed');
        }
    // if (!error.isEmpty()){
    //     const error =new Error('validation failed!');
    //     error.statusCode=422;
    //     error.data=errors.array();
    //     throw error;
    
    // }
const userId=req.userId;
const oldpassword=req.body.oldpassword;
const newpassword=req.body.newpassword;
let loadeduser;
User.findById(userId)
.then(user=>{

    loadeduser=user;
    return bcrypt.compare(oldpassword,user.password);
})
.then (isequal=>{
    if (!isequal){
        const error= new Error('User old  password is not correct');
        error.statusCode=401;
        throw error;
    }
    return bcrypt.hash(newpassword,12);
})
.then (hashedone=>{
    loadeduser.password=hashedone;
    return  loadeduser.save();
})
.then (res=>{
    res
    .status(201)
    .json(' user password is updated successfully');
})
.catch(err=>{
    if (!err.statusCode)
        err.statusCode=500;
      next(err);
    });
};

const clearimage=imageUrl=>{
const imagepath=path.join(__dirname,'..',imageUrl);
fs.unlink(imagepath,err=>{
    next(err);
})
};