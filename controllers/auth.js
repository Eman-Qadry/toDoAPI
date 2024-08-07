
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const{validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
const sendgridtransport=require('nodemailer-sendgrid-transport');
const nodemailer=require('nodemailer');
const { request } = require('express');
const transporter=nodemailer.createTransport(sendgridtransport({
  auth:{
    api_key:process.env.transporter_key
  }
}));


const sendEmail = function (email,message){
transporter.sendMail({
    to:email,
    from:process.env.ownerEmail,
    subject:'Reset password',
    html: message
})
};
const token= id=>{

return jwt.sign({
    
    userId:id
},process.env.JWT_SECRET,
{expiresIn:process.env.JWT_EXPIRES_IN});
}
const createSendToken=(user,statusCode,res)=>{

const signtoken=token(user._id);
res.status(statusCode).json({
    message:'user is logged In successfully',
    Token:signtoken,
    userId:user._id
});

}
exports.signup=(req,res,next)=>{
    
const errors = validationResult(req);
console.log(errors);
if (!errors.isEmpty()){
    const error =new Error('validation failed!');
    error.statusCode=422;
    error.data=errors.array();
    throw error;

}

const { name,email, password } = req.body;
bcrypt.hash(password,12).then(hashedpass=>{
const user=new User({
    email:email,
    password:hashedpass,
    name:name
});
    return user.save()
})
.then(newone=>{

    res.status(201).json({
        message:'New user is created successfully.',
        userId:newone._id
    })
})
.catch(err=>{
    if (!err.statusCode)
        err.statusCode=500;
    next(err);
});
};


exports.login=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    let loadedUser;
    User.findOne({email:email}).then(user=>{
    if (!user){
        const error= new Error('User with rhis email not found');
        error.statusCode=401;
        throw error;
    }
    loadedUser=user;
    return bcrypt.compare(password,user.password)
})
    .then(isEqual=>{
        if (!isEqual){
            const error= new Error('User password is not correct');
            error.statusCode=401;
            throw error;
        }
        createSendToken(loadedUser,200,res);
       
    })
 
    .catch(err=>{
        if (!err.statusCode)
            err.statusCode=500;
        next(err);
    });
};

exports.forgotpassword=async (req,res,next)=>{
    const email=req.body.email;
    const user= await User.findOne({email:email});
        if (!user){
            const err=new Error ('could not find user with this email');
            err.statusCode=404;
            next(err);
        }
        const resetToken= user.createpasswordresetToken();
       await user.save();

       const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;
    
      const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: 
      ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try{
     await sendEmail(email,message);
    
    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      })}

    catch{
        user.passwordResetToken=undefined;
        user.tokenExpiration=undefined;
        await user.save();
        const err=new Error ('there is an error sending email ');
        err.statusCode=500;
        next(err);
    }


   
}
exports.resetToken=async (req,res,next)=>{
    const resetToken=req.params.token;
    const password=req.body.password;
    const confirmpassword=req.body.confirmpassword;
    if (password != confirmpassword){
        const err=new Error ('confirm password not equal new password');
            err.statusCode=500;
            next(err);
    }
    const user= await User.findOne({
        passwordResetToken:resetToken,
        tokenExpiration:{$gt:Date.now()}
    });
    if (!user){
        const err=new Error ('could not find user ,try again');
            err.statusCode=404;
            next(err);
    }
    const hashedpassword= await bcrypt.hash(password,12);
    user.password=hashedpassword;
    await user.save();
    res.status(200)
    .json({
    
        message: 'password is reset successfully.'
      });

}