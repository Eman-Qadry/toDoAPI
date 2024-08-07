const task=require('../models/task');
const {validationResult}=require('express-validator');
const User= require('../models/user');
exports.getTasks=(req,res,next)=>{
   const userId=req.userId;
    task.find({userId: userId}).then(tasks=>{
        if (!tasks){
            const error = new Error('could not find task!');
            error.statusCode=404;
            throw error;
           
        }
        res.status(200).json({
            message:"success",
            data:{
                tasks
            }
        })
    }).catch(err=>{
        if (!err.statusCode)
            err.statusCode=500;
        next(err);
    })
}

exports.getTaskById=(req,res,next)=>{
    const id=req.params.id;
    task.findById(id).then(Task=>{
   if (!Task){
    const error = new Error('could not find task!');
    error.statusCode=404;
    throw error;
}
    res.status(200).json({
        message:"success",
        data:{
            task
        }
    });
   
    }).catch(err=>{
        if (!err.statusCode)
            err.statusCode=500;
        next(err);
    })
}
exports.createTask=(req,res,next)=>{
    try{
        const errors = validationResult(req);}
        catch(err){
        console.log('crashed');
        }
    let creator;
    // if (!errors.isEmpty()){
    //     return res.status(400).json({ errors: errors.array() });
    // }
    const newTask= new task({
     title:req.body.title,
     description:req.body.description,
     userId:req.userId,
     priority :req.body.priority,
     startDate:req.body.startDate,
     endDate:req.body.endDate,
     completed:req.body.completed
 } );
 newTask.save().then(res=>{
    return User.findById(req.userId);})

 .then (user=>{
        user.tasks.push(newTask );
        creator= user;
       return user.save();})

 .then(res=>{
  res.status(201).json({
    message:"task added successfully",
    data:{
      task:  newTask  ,
      creator :{_id :creator._id , name:creator.name}
    }
  })
 })
 .catch(err=>{
    if (!err.statusCode)
        err.statusCode=500;
    next(err);
 })
}

exports.deleteTask=(req,res,next)=>{
    let deleted;
    task.findById(req.params.id).then(Task=>{
        if (!Task){
            const err= new Error ('could not find task');
            err.statusCode=404;
            throw err;
        }
        // check the creator is the logged on user
        if (task.userId.toString() != req.userId){
            const err= new Error ('not authorized user');
            err.statusCode=403;
            throw err;
        }
        
        return task.findByIdAndDelete(Task._id)})
 .then(Task=>{
        deleted=Task;
        return User.findById(req.userId);})

.then(user=>{
    
 user.tasks.pop(deleted._id);
  return user.save();})
  .then (result=>{
  res.status(200).json({
    message:"task deleted successfully"
  })
    })
    .catch(err=>{
        if (!err.statusCode)
            err.statusCode=500;
        next(err);
     });
}
exports.EditTask=(req,res,next)=>{

    try{
        const errors = validationResult(req);}
        catch(err){
        console.log('crashed');
        }
    const taskId=req.body.taskId;
     const title=req.body.title;
     const description=req.body.description;
     const startDate=req.body.startDate;
     const endDate=req.body.endDate;
    const completed=req.body.completed;
    const priority=req.body.priority;
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    task.findById(taskId)
    .then(Task=>{
        if (!Task){
            const err= new Error ('could not find task');
            err.statusCode=404;
            throw err;
        }
        if (task.userId.toString() != req.userId){
            const err= new Error ('not authorized user');
            err.statusCode=403;
            throw err;
        }

       task.title=title;
        task.description=description;
        task.startDate=startDate;
        task.endDate=endDate;
        task.completed=completed;
        task.priority=priority;
        return task.save()

    })

.then(result=>{

            res.status(200).json({ message:"Task updated successfully",
                data:{
                    task:result,
                    creator :{
                        _id:req.userId
                    }
                }
            });

        }).catch(err=>{
            if (!err.statusCode)
                err.statusCode=500;
            next(err);
        })
};
