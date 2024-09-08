import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

export const  google = async (req,res) => {
    try {
      const user = await User.findOne({email: req.body.email})
      const users = await User.find()
      console.log(users);
      // 1. If the user is new , then create an account
      // 2. else authenticate
      
      if(user) { // User already present cases

             const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
            const { password: pass, ...rest } = user._doc;
            res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
      }else {
   
          const randomPassword = Math.random().toString(36).slice(-8)
          const hashedPassword = bcryptjs.hashSync(randomPassword,10);
    
          const newUser = new User({
            username: req.body.username.split(' ').join('').toLowerCase()+Math.random().toString(36).slice(-4),
            email: req.body.email,
            password:hashedPassword
          })
   
          await newUser.save();
        
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
          const { password: pass, ...rest } = newUser._doc;
          res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
  
        }
    }
    catch(err) {
      res.status(400).json(JSON.stringify("Error"));
      console.log(err.message);
    }
  }
  
  export const signOut = (req,res,next) => {
  
    try {
      res.clearCookie('acces_token')
      res.status(200).json("User has been logged out.")
    } 
    catch(err) {
      console.log(err.message);
    }
  }