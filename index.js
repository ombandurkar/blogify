require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const cookieParse = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./model/blog');
const exp = require('constants');

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
            .then(console.log('MongoDB connected'))
            .catch((err)=>{
                console.log(err);
            });

app.set('view engine' , 'ejs');
app.set('views' , path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParse());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.use('/user' , userRoute);
app.use('/blog' , blogRoute);

app.get('/' , async (req , res) => {
    const allBlogs = await Blog.find({});
    return res.render('home' , {
        user: req.user,
        blogs: allBlogs
    })
})


app.listen(PORT , ()=>{
    console.log(`Server started at Port: ${PORT}`);
})