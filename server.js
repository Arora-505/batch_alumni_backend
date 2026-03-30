require("dotenv").config();
const express=require("express");
const db=require("./config/db");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const errorHandler=require("./middleware/errorHandler");
db();
const app=express();
const port=process.env.PORT||5000;
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use("/api/alumni",require("./routes/alumni_Routes"));
app.use("/api/users",require("./routes/user_Routes"));
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});