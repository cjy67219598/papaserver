let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");
let multer = require("multer");
let path = require("path");
let makeDir = require("./utils/makeDir");
let isLogin = require("./utils/isLogin");

/* GET users listing. */

router.post("/register",(req,res,next) => {//用户注册
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
            let obj = {
              message:"注册成功！"
            };
            obj.status = 200;
            next(obj);
        }
    });
});
router.post("/exist",(req,res,next) => {//检查用户名是否存在
    UserModel.find({username:req.body.username},(err,doc) => {
        try{
            if(err) return next(err);
            if(doc.length !== 0){
                err = new Error("用户名已存在!");
                err.status = 400;
                next(err);
            }else{
                let obj = {
                  message:"恭喜您，用户名可用！"
                };
                obj.status = 200;
                next(obj);
            }
        }catch(err){

        }
    });
});
router.post("/login",(req,res,next) => {//用户登录
    UserModel.findOne({username:req.body.username},(err,doc) => {
        try{
            if(err) return next(err);
            if(!doc){
                err = new Error("用户名不存在！");
                err.status = 400;
                return next(err);
            }
            if(doc.password === req.body.password){
                res.cookie("username",doc.username,{
                    expires:0,
                    httpOnly: true
                });
                res.cookie("password",doc.password,{
                    expires:0,
                    httpOnly: true
                });
                let obj = {
                  message:"登陆成功！"
                };
                obj.status = 200;
                next(obj);
            }else{
                err = new Error("密码错误！");
                err.status = 400;
                next(err);
            }
        }catch(err){
            next(err);
        }
    });
});
router.post("/isLogin",(req,res,next) => {
    if(req.cookies.username && req.cookies.password){
        UserModel.findOne({username:req.cookies.username},(err,doc) => {
            try{
                if(err) return next(err);
                if(!doc){
                    err = new Error("登录信息不存在！");
                    err.status = 400;
                    return next(err);
                }
                if(doc.password === req.cookies.password){
                    let obj = {
                      message:"登陆成功！"
                    };
                    obj.status = 200;
                    obj.data = {
                        nickname:doc.nickname,
                        headImg:doc.headImg,
                        tel:doc.tel,
                        email:doc.email
                    };
                    next(obj);
                }else{
                    err = new Error("登录信息不存在！");
                    err.status = 400;
                    next(err);
                }
            }catch(err){
                next(err);
            }
        });
    }else{
        let err = new Error("用户尚未登陆！");
        err.status = 400;
        next(err);
    }
});

//头像上传
let upload = multer({
    storage:multer.diskStorage({
        //设置上传文件的保存路径,需手动创建文件夹
        destination:(req,file,cb) => {
            let dir = path.resolve("./upload/head/" + req.cookies.username);
            makeDir(dir,(err) => {
                if(err) return cb(err);
                cb(null,dir);
            });
        },
        //给上传的文件重命名
        filename:(req,file,cb) => {
            cb(null,req.cookies.username + /\.[^\.]+$/.exec(file.originalname));
        }
    }),
    limits:{
        fileSize:1024 * 1024 * 5  //大小限制
    },
    fileFilter:(req,file,cb) => {  //过滤器
        let mineType = file.mimetype;
        if(/image/i.test(mineType)){
            cb(null,true);
        }else{
            let err = new Error("the mineType is not allowed");
            err.status = 400;
            cb(err);
        }
    }
});
router.post("/upload",isLogin,upload.fields([{ name:"image", maxCount: 1}]),(req,res,next) => {
    UserModel.findOne({username:req.cookies.username},(err,doc) => {
        try{
            if(err) return next(err);
            doc.headImg = "/upload/head/" + req.cookies.username + "/" + req.files["image"][0].filename;
            doc.updateTime = Date.now();
            doc.save(err => {
                if(err) return next(err);
                let obj = {
                  message:"头像上传成功！"
                };
                obj.status = 200;
                next(obj);
            });
        }catch(err){
            next(err);
        }
    });
});

//修改资料
router.post("/edit",isLogin,(req,res,next) => {
    UserModel.findOne({username:req.cookies.username},(err,doc) => {
        try{
            if(err) return next(err);
            typeof req.body.password !== "undefined" && (doc.password = req.body.password);
            typeof req.body.tel !== "undefined" && (doc.tel = req.body.tel);
            typeof req.body.email !== "undefined" && (doc.email = req.body.email);
            typeof req.body.nickname !== "undefined" && (doc.nickname = req.body.nickname);
            typeof req.body.introduction !== "undefined" && (doc.introduction = req.body.introduction);
            doc.updateTime = Date.now();
            doc.save(err => {
                try{
                    if(err) return next(err);
                    let obj = {
                        message:"修改成功！",
                        status:200
                    };
                    next(obj);
                }catch(err){
                    next(err);
                }
            });
        }catch(err){
            next(err);
        }
    });
});


module.exports = router;