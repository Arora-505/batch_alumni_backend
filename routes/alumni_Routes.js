const express=require("express");
const router=express.Router();
const{get_alumni,add_alumni,get_all_alumni,update_Alumni ,delete_Alumni}=require("../controller/alumni_Controller");
const validateToken=require("../middleware/validationTokenHandler");
router.route("/").get(get_all_alumni).post(validateToken,add_alumni);
router.route("/get").get(validateToken,get_alumni);
router.put("/edit",validateToken, update_Alumni);
router.delete("/delete",validateToken, delete_Alumni);
module.exports=router;