require("dotenv").config();
const express=require("express");
const db=require("./config/db");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const errorHandler=require("./middleware/errorHandler");
const path=require("path");
db();
const app=express();
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
const port=process.env.PORT||5000;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true
}));
app.use("/api/alumni",require("./routes/alumni_Routes"));
app.use("/api/users",require("./routes/user_Routes"));
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});