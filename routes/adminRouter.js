//This file will handle all the requests coming to /admin

const express = require("express");
const { adminModel ,assignmentModel} = require("../db");
const {Router} =express; //importing Router
const adminRouter = Router();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
const { adminMiddleware } = require("../middlewares/admin"); //auth middleware for admin
dotenv.config();
const JWT_SECRET= process.env.JWT_SECRET;
const {z} = require("zod"); //using zod library for input validation


adminRouter.post("/register" ,async function(req,res){




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
 
     await adminModel.create({
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

adminRouter.post("/login" , async function(req,res){
    const {password , email}  = req.body;

   try{
    const admin = await adminModel.findOne({
        email : email,

    })

   
    if(!admin){
        return res.json({
            message : "No Admin found !"
        })
    }


    const passwordMatch = await bcrypt.compare(password,admin.password);
   

    if(passwordMatch){
          const token = jwt.sign({
            id : admin._id,
            role : 'admin'
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



adminRouter.get("/assignments" , adminMiddleware, async function(req,res){

    try{
        const assignments = await assignmentModel.find({
            adminId : req.adminId
          })
       
          if(assignments){
           return res.json({
               assignments
           })
       
          }
       
          else{
           return res.json({
               message : "No assignments found !"
           })
          }

    }catch(error){
        return res.json({
            message : error
        })
    }
  
})

adminRouter.post("/assignments/:id/accept" , adminMiddleware,async function(req,res){
  const id = req.params.id;

  try{
   
    
       const assignment =  await assignmentModel.findOneAndUpdate({_id : id , adminId : req.adminId},{status : 'accepted'})
        console.log(assignment);

       if(!assignment){
        return res.json({
            message : "No assignment found"
        })
       }

        return res.json({
            message : "assignment accepted !"
        })

  }catch(error){
    return res.status(404).json({
        message : error
    }
    )
  }

})
adminRouter.post("/assignments/:id/reject" , adminMiddleware,async function(req,res){
    const id = req.params.id;

    try{
     
      
         const assignment =  await assignmentModel.findOneAndUpdate({_id : id , adminId : req.adminId},{status : 'rejected'})
          console.log(assignment);
  
         if(!assignment){
          return res.json({
              message : "No assignment found"
          })
         }
  
          return res.json({
              message : "assignment rejected !"
          })
  
    }catch(error){
      return res.status(403).json({
          message : error
      }
      )
    }
})


module.exports = {
    adminRouter : adminRouter
}
