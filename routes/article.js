let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");
let multer = require("multer");
let path = require("path");
let MakeDir = require("./utils/makeDir");
let isLogin = require("./utils/isLogin");
let pageQuery = require("./utils/page");
//头像上传
let upload = multer({
    storage:multer.diskStorage({
        //设置上传文件的保存路径,需手动创建文件夹
        destination:(req,file,cb) => {
            let dir = path.resolve("./upload/article/" + req.cookies.username);
            new MakeDir(dir,(err) => {
                if(err) return cb(err);
                cb(null,dir);
            });
        },
        //给上传的文件重命名
        /*filename:(req,file,cb) => {
            console.log(file);
            cb(null,req.cookies.username + /\.[^\.]+$/.exec(file.originalname));
        }*/
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
//上传博客图片
router.post("/upload",isLogin,upload.fields([{ name:"image", maxCount: 1}]),(req,res,next) => {
    UserModel.findOne({username:req.cookies.username},(err,doc) => {
        try{
            if(err) return next(err);
            let img = "/upload/article/" + req.cookies.username + "/" + req.files["image"][0].filename;
            res.send({
                errno:0,
                data:[img]
            });
        }catch(err){
            next(err);
        }
    });
});
//保存&修改博客
router.post("/save",isLogin,(req,res,next) => {
    if(!req.body.id){
        let article = new ArticleModel({
            title:req.body.title,
            content:req.body.content,
            intro:req.body.intro,
            hidden:req.body.hidden,
            category:req.body.category,
            user:req.user_id
        });
        article.save(err => {
            if(err) return next(err);
            let obj = {
                message:"保存成功！"
            };
            obj.status = 200;
            next(obj);
        });
    }else{
        ArticleModel.findOne({_id:req.body.id}).exec((err,doc) => {
            try{
                if(err) return next(err);
                if(!doc){
                    err = new Error("文章不存在！");
                    err.status = 400;
                    next(err);
                }else{
                    if(doc.user.toString() === req.user_id.toString()){
                        typeof req.body.title !== "undefined" && (doc.title = req.body.title);
                        typeof req.body.content !== "undefined" && (doc.content = req.body.content);
                        typeof req.body.intro !== "undefined" && (doc.intro = req.body.intro);
                        typeof req.body.hidden !== "undefined" && (doc.hidden = req.body.hidden);
                        typeof req.body.category !== "undefined" && (doc.category = req.body.category);
                        doc.save(err => {
                            if(err) return next(err);
                            let obj = {
                                message:"修改成功！"
                            };
                            obj.status = 200;
                            next(obj);
                        });
                    }else{
                        err = new Error("用户与数据不匹配！");
                        err.status = 400;
                        next(err);
                    }
                }
            }catch(err){
                next(err);
            }
        });
    }
});
//获取本人博客列表
router.post("/list",isLogin,(req,res,next) => {
    let page = req.body.page || 1;
    let size = Number(req.body.size || 10);
    let reg = new RegExp(req.body.keywords,"i");
    let query = {
        user:req.user_id,
        $or:[{
            title:reg
        },{
            intro:reg
        },{
            content:reg
        }]
    };
    let obj = {
        message:"成功！"
    };
    obj.status = 200;
    pageQuery.normal(page,size,{collected:0},ArticleModel,"",query,{}).then(arr => {
        obj.page = arr[0];
        obj.data = arr[1];
        next(obj);
    }).catch(err => {
        next(err);
    });
});
//删除博客
router.post("/del",isLogin,(req,res,next) => {
    UserModel.findOne({username:req.cookies.username},(err,userDoc) => {
        try{
            if(err) return next(err);
            ArticleModel.findOne({_id:req.body.id}).exec((err,doc) => {
                try{
                    if(err) return next(err);
                    if(!doc){
                        err = new Error("文章不存在！");
                        err.status = 400;
                        next(err);
                    }else{
                        if(doc.user.toString() === userDoc._id.toString()){
                            doc.remove(err => {
                                if(err) return next(err);
                                let obj = {
                                    message:"删除成功！"
                                };
                                obj.status = 200;
                                next(obj);
                            });
                        }else{
                            err = new Error("用户与数据不匹配！");
                            err.status = 400;
                            next(err);
                        }
                    }
                }catch(err){
                    next(err);
                }
            });
        }catch(err){
            next(err);
        }
    });
});
//评论
router.post("/comment",isLogin,(req,res,next) => {
        let comment = new CommentModel({
            content:req.body.content,
            article:req.body.id,
            user:req.user_id
        });
        comment.save(err => {
            if(err) return next(err);
            next({
                message:"发表成功！",
                status:200
            });
        });
});
//删除评论
router.post("/delComment",isLogin,(req,res,next) => {
    CommentModel.findOne({_id:req.body.id},(err2,doc2) => {
        try{
            if(err2) return next(err2);
            if(req.user_id.toString() !== doc2.user.toString()){
                return next({
                    message:"用户信息不匹配！",
                    status:400
                });
            }
            doc2.remove(err => {
                if(err) return next(err);
                next({
                    message:"删除成功！",
                    status:200
                });
            });
        }catch(err){
            next(err);
        }
    });
});
//评论列表
router.post("/comments",(req,res,next) => {
    let query = {
        article:req.body.id
    };
    let page = req.body.page || 1;
    let size = Number(req.body.size || 20);
    pageQuery.normal(page,size,{},CommentModel,{path:"user",select:["nickname","headImg"]},query,{createTime:-1}).then(arr => {
        next({
            message:"成功！",
            status:200,
            page:arr[0],
            data:arr[1]
        });
    }).catch(err => {
        next(err);
    });
});


module.exports = router;