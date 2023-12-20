const {createHmac , randomBytes} = require('crypto')  //built-in package hai
//createHmac helps us to hash our password
const mongoose = require('mongoose');
const {createTokenForUser , validateToken} = require('../services/authentication')

const userSchema = mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    salt:{
        type: String
    },
    password:{
        type: String,
        require: true
    },
    profileImageURL:{
        type: String,
        default: '/images/userDefault.png'
        
    },
    role:{
        type: String,
        enum: ['USER' , 'ADMIN'],  //ye dono ke alava koi aur value nahi de sake
        default: 'USER'
    }
} , {timestamps: true});

//jab bhi user ko tum save karoge to ye hoga, next function
userSchema.pre('save' , function (next){
    //'this' is pointing towards current user
    const  user = this;
    //agr user ka password hee modified nahi hai to return
    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    // const salt = 'someRandomSalt';

    // konsa algorithm use karna chaahte to , konse key ko use karke tum hash karna chaahte ho
    const hashedPassword = createHmac('sha256' , salt)
                            .update(user.password)
                            .digest('hex');   //give it to me in a hex form

    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static('matchPasswordAndGenerateToken' , async function (email , password){
    const user = await this.findOne({email});

    if(!user) throw new Error('user not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac('sha256' , salt)
                                .update(password)
                                .digest('hex');

    if(hashedPassword !== userProvidedPassword) throw new Error('incorrect password');

    //jab match hojaaye tab hum user return kar dege but password and salt nahi bhejege
    // return {...user , password : undefined, salt: undefined};

    const token =  createTokenForUser(user);
    return token;
})

const User = mongoose.model('user' , userSchema);

module.exports = User;