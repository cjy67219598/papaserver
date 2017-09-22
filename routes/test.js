/**
 * Created by Administrator on 2017/8/27.
 */
let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");
let multer = require("multer");
let path = require("path");
let MakeDir = require("./utils/makeDir");

router.get("/test1", (req, res, next) => {
    let user = new UserModel({
        username:"admin",
        tel:"18236698270",
        email:"447334358@qq.com",
        nickname:"papachen",
        password:"a67219598",
        introduction:"个人简介"
    });
    user.save(err => {
        if(err) return next(err);
        res.send({
            mes:{
                status:1,
                result:"成功"
            }
        });
    });
});
router.get("/test2", (req, res, next) => {
    UserModel.findOne({username:"admin"},(err,doc) => {
        if(err) return next(err);
        let article = new ArticleModel({
            title:"这是标题",
            content:"这是内容",
            user:doc._id
        });
        doc.articles.push(article);
        doc.save(err => {
            if(err) return next(err);
            article.save(err => {
                if(err) return next(err);
                res.send({
                    mes:{
                        status:1,
                        result:"成功"
                    }
                });
            });
        });
    });
});
router.get("/test3",(req,res,next) => {
    ArticleModel.findOne({title:"这是标题"}).populate("user").exec((err,doc) => {
        if(err) return next(err);
        res.send(doc);
    });
});
router.get("/test4",(req,res,next) => {
    ArticleModel.find({user:"59a25d3f95ca8d2a004cac1b"}).populate("user",["username","nickname"]).exec((err,doc) => {
        if(err) return next(err);
        res.send(doc);
    });
});
router.get("/test5",(req,res,next) => {
    UserModel.find({username:"admin"}).populate("articles",["title"]).exec((err,doc) => {
        if(err) return next(err);
        res.send(doc);
    });
});




let upload = multer({
    // dest:"./upload/",
    storage:multer.diskStorage({
        //设置上传文件的保存路径,需手动创建文件夹
        destination:(req,file,cb) => {
            let dir = path.resolve("./upload/head");
            new MakeDir(dir,(err) => {
                if(err) return cb(err);
                cb(null,dir);
            });
        },
        //给上传的文件重命名
        filename:(req,file,cb) => {
            cb(null,"test.png");
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
router.post("/upload",upload.fields([{ name:"image", maxCount: 1}]),(req,res,next) => {
    res.send(req.files["image"][0].filename);
});

router.get("/ip",(req,res,next) => {
    res.send({
        ip:req.ip
    });
});

module.exports = router;