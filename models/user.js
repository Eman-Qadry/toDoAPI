
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');const mongoose=require("mongoose");
const schema=mongoose.Schema;
const userSchema=new schema({
    name:{
        type: String,
        required:true
    },
    age:{
       type:Number
    },
    address:{
        type:String
     },
     
    email:{
        type: String,
        reqired:true
    },
    password:{
        type: String,
        reqired:true
    },
    imgUrl:{
        type: String,

    },
    passwordResetToken:{
        type:String
    },
    tokenExpiration:{
        type:Date
    }
    , tasks:[{
   type:mongoose.SchemaTypes.ObjectId,
    ref:'Task'
    }]
});
userSchema.methods.correctPassword=async function (expectedpassword,userpassword){
    return await bcrypt.compare(expectedpassword,userpassword);

};
userSchema.methods.createpasswordresetToken= function (){
const resetToken= crypto.randomBytes(12).toString('hex');
this.passwordResetToken= resetToken;
this.tokenExpiration=Date.now()+3600000;
return resetToken;
};

module.exports=mongoose.model('User',userSchema);