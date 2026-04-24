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
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"./views"));
app.use(express.static(staticPath));
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" });
});
const port=process.env.PORT||5000;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5501',
    credentials: true
}));
app.use("/api/alumni",require("./routes/alumni_Routes"));
app.use("/api/users",require("./routes/user_Routes"));
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});