/**
 * Created by Administrator on 2017/8/27.
 */
let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");

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

module.exports = router;