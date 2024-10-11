//This file will handle all the requests coming to /user

const express = require("express");
const {userModel , adminModel , assignmentModel} = require("../db")
const {Router} =express; //importing Router
const userRouter = Router();
const bcrypt = require("bcrypt"); // using bcrypt library for password hashing
const jwt = require("jsonwebtoken"); // using jwt for authentication
const {userMiddleware} = require("../middlewares/users");
const dotenv = require("dotenv");
const {z} = require("zod");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

userRouter.post("/register" , async function(req,res){   //registering the user

    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        firstName: z.string().min(3),  // Validating first name
        lastName: z.string().min(3),   // Validating last name
        password: z.string().min(3).max(30), // Basic password validation
    });

    // parsing and validating the request body
    const parsedDatawithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDatawithSuccess.success) {
        const errors = parsedDatawithSuccess.error.errors.map(err => err.message);
        return res.status(400).json({
            message: "Validation failed",
            errors: errors,
        });
    }



   const { email ,firstName ,lastName , password} = req.body;
   const hashedPassword  = await bcrypt.hash(password,5) // hashing the password with 5 salt rounds

   try{

    await userModel.create({
        email : email,
        firstName : firstName,
        lastName : lastName,
        password : hashedPassword
    })

    return res.status(200).json({
        message : "You're Signed Up Succesfully"
    })
    
   }catch(error){
     return res.json({
        message : error
     })
   }






})
userRouter.post("/login" , async function(req,res){ // login endpoint for the user

    const {password , email}  = req.body;

   try{
    const user = await userModel.findOne({
        email : email,

    })


    if(!user){
        return res.json({
            message : "No user found !"
        })
    }


    const passwordMatch = await bcrypt.compare(password,user.password);
 

    if(passwordMatch){
          const token = jwt.sign({
            id : user._id,
            role : 'user'
          },JWT_SECRET);


          return res.json({
            message : token
          })
    }

    else{
        return res.status(403).json({
            message : "Incorrect Credentials !"

        })
    }



   } catch(error){
      return res.json({
        message : error
      })
   }

   


   
})

userRouter.post("/upload" , userMiddleware, async function(req,res){
   
   const {task , adminEmail } = req.body;

   

    try{
      
        const admin = await adminModel.findOne({
            email : adminEmail
        })

        if(admin){

            const adminId = admin._id;
            await assignmentModel.create({
                userId : req.userId,
                task: task,
                adminId : adminId,
               
               })

               return res.json({
                message : "Assignment uploaded succesfully !"
               })
            
        }


        else{

            return res.json({
                message : "No admin Found"
            })
        }

       

    }catch(error){
        res.json({
            message: error
        })
    }

})

userRouter.get("/admins" ,userMiddleware, async function(req,res){

   const admins = await adminModel.find({});

   try{
    if(admins){
        return res.json({
            admins
        })
       }
    
       else{
        return res.json({
            message : "No admins found "
        })
       }
    
   } catch(error){
    return res.json({
        error
    })
   }


  
})


module.exports = {
    userRouter : userRouter
}
