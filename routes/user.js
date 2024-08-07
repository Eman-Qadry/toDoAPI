const express= require('express');
const router= express.Router();
const usermodel=require('../models/user');
const authcontroller=require('../controllers/auth');
const usercontroller=require('../controllers/user');
const isAuth=require('../middleware/is-auth');
const {body,check}=require('express-validator');
const  createuserValidationRules =[
body('email')
.notEmpty().withMessage('Email is required')
.isEmail().withMessage('Email is not valid')
.custom((value,{req})=>{
return usermodel.findOne({email:value}).then(user=>{
    if (user)
        return Promise.reject('Email address is already exists!');
});
})
,
check('password')
.trim()
.notEmpty().withMessage('Password is required')
.isLength({min:8}).withMessage('Password length must be at least 8 char')
,

check('name')
.trim()
.notEmpty().withMessage('name is required')
.isString().withMessage('User name must be string ')
];

const  EdituserValidationRules =[
   
    check('age')
    .optional()
    .trim()
    .notEmpty().withMessage('user age must not be empty')
    .isNumeric().withMessage('User age must be number ')
    ,
    check('address')
    .optional()
    .trim()
    .notEmpty().withMessage('address must not be empty')
    .isString().withMessage('User address must be string ')
    ,
    check('name')
    .optional()
    .trim()
    .notEmpty().withMessage('user name must not be empty')
    .isString().withMessage('User name must be string ')
    ];

const editPassword=[
    
    check('oldpassword')
    .notEmpty().withMessage('old Password is required')

    ,
    check('newpassword')
    .trim()
    .notEmpty().withMessage('new Password is required')
    .isLength({min:8}).withMessage('Password length must be at least 8 char')
];

router
.post('/signup',createuserValidationRules,authcontroller.signup);

router
.post('/login',authcontroller.login);



router.post('/forgotpassword',authcontroller.forgotpassword);


router.post( '/resetpassword',authcontroller.resetToken);

router
.route('/users/profile')
.put(isAuth, EdituserValidationRules,usercontroller.editUser)
.post(isAuth,usercontroller.profile);

router
.route('/users/password')
.put(isAuth,editPassword,usercontroller.editpassword);

module.exports=router;