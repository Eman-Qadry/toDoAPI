const mongoose=require("mongoose");
const schema=mongoose.Schema;
const taskSchema=new schema({
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true  
},
startDate:{
    type:String,
    required:true  
},
endDate:{
    type:String,
    required:true  
},
completed:{
    type:Boolean,
    required:true 
},
priority:{
    type:String,
    required:true 
},
userId:{
    type:mongoose.SchemaTypes.ObjectId,
    ref:'User'
}
})
module.exports=mongoose.model('Task',taskSchema);