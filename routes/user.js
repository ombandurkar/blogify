const express = require('express');
const User = require('../model/user');

const router = express.Router();

router.get('/signup' , (req , res)=>{
    return res.render('signup');
})

router.get('/signin' , (req , res)=>{
    return res.render('signin');
})

router.post('/signup' , async (req , res)=>{
    const {fullName , email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });

    return res.redirect('/')
})

router.post('/signin' , async (req , res) => {
    const {email , password} = req.body;

    try {
        //we will use mongoose virtual function to validate, its in user model, hum ek particular schema ke upar function bana sakte hai
        const token = await User.matchPasswordAndGenerateToken(email , password);

        return res.cookie('token' , token).redirect('/');
        
    } catch (error) {
        return res.render('signin' , {
            error: 'Incorrect email or passowrd'
        })
    }
})

router.get('/logout' , (req , res)=>{
    res.clearCookie('token').redirect('/');
})

module.exports = router;