const app =require('./app');
const mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/ToDo').then(result=>{
    console.log("connected to data base");
    app.listen(4000,()=>{
        console.log("server is running");
    })
})
.catch(err=>{
    console.log(err);
});

