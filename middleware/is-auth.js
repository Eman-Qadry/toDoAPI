const jwt= require('jsonwebtoken');
const isAuth=async(req,res,next)=>{
    
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        const err= new Error('You are not logged in! Please log in to get access.');
        err.statusCode=401;
        return next(err );
      }
   
    let decodedtoken;
try{

    decodedtoken =await  promisify(jwt.verify)(token,process.env.JWT_SECRET);
}
catch(err){
    err.statusCode=500;
    throw err;
}
 if (!decodedtoken){
    const err=new Error('Not Authorized yet!');
    err.statusCode=401;
    throw err;
 }
    req.userId=decodedtoken.userId;
    next();
};
module.exports=isAuth;