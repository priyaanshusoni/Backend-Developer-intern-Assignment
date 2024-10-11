//Entry point of my assignment submission portal 
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const {userRouter}= require("./routes/userRouter");
const {adminRouter}= require("./routes/adminRouter");


dotenv.config();

app.use(express.json()); // used to parse the upcoming json data from user

const PORT = process.env.PORT;

const DATABASE_URL = process.env.DATABASE_URL;


app.use("/user" , userRouter); //all requests to /user will be handeled by userRouter
app.use("/admin" , adminRouter); // all requests to /admin will be handeled by adminRouter


async function main(){
    await mongoose.connect(DATABASE_URL);
    app.listen(PORT);
    console.log(`App is istening on ${PORT}`);
   
}


main();




