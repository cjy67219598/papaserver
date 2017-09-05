let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");
let multer = require("multer");
let path = require("path");
let makeDir = require("./business/makeDir");

function isLogin(req, res, next) {

}

/* GET users listing. */

router.post("/register",(req,res,next) => {
    let user = new UserModel({
        username:req.body.username,
        tel:req.body.tel,
        email:req.body.email,
        nickname:req.body.nickname,
        password:req.body.password,
        introduction:req.body.introduction
    });
    user.save(err => {
        if(err){
            if(err.code === 11000){
                err.status = 400;
                err.message = "用户名已存在!";
                next(err);
            }else{
                next(err);
            }
        }else{
            err = new Error("注册成功！");
            err.status = 200;
            next(err);
        }
    });
});
router.post("/exist",(req,res,next) => {
    UserModel.find({username:req.body.username},(err,doc) => {
        if(err) return next(err);
        if(doc.length !== 0){
            err = new Error("用户名已存在!");
            err.status = 400;
            next(err);
        }else{
            err = new Error("恭喜您，用户名可用！");
            err.status = 200;
            next(err);
        }
    });
});

module.exports = router;