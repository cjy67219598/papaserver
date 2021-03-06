let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");
let multer = require("multer");
let path = require("path");
let MakeDir = require("./utils/makeDir");
let isLogin = require("./utils/isLogin");
let pageObj = require("./utils/page");

/* GET users listing. */
//用户注册
router.post("/register",(req,res,next) => {
    let user = new UserModel({
        username:req.body.username,
        tel:req.body.tel,
        email:req.body.email,
        nickname:req.body.nickname,
        password:req.body.password,
        introduction:req.body.introduction,
        sex:req.body.sex
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
//检查用户名是否存在
router.post("/exist",(req,res,next) => {
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
//用户登录
router.post("/login",(req,res,next) => {
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
                    httpOnly: true,
                    path:"/"
                });
                res.cookie("password",doc.password,{
                    expires:0,
                    httpOnly: true,
                    path:"/"
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
//退出登陆
router.post("/signOut",(req,res,next) => {
    res.clearCookie("username",{path:"/"});
    res.clearCookie("password",{path:"/"});
    next({
        message:"退出成功！",
        status:200
    });
});
//检查登陆
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
            new MakeDir(dir,(err) => {
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
            typeof req.body.tel !== "undefined" && (doc.tel = req.body.tel);
            typeof req.body.email !== "undefined" && (doc.email = req.body.email);
            typeof req.body.nickname !== "undefined" && (doc.nickname = req.body.nickname);
            typeof req.body.introduction !== "undefined" && (doc.introduction = req.body.introduction);
            typeof req.body.sex !== "undefined" && (doc.introduction = req.body.sex);
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
//用户信息
router.post("/userInfo",(req,res,next) => {
    let query;
    if(req.body.id){
        query = {
            _id:req.body.id
        };
    }else{
        query = {
          username:req.cookies.username
        };
    }
    UserModel.findOne(query).select({
        username:0,
        password:0,
        following:0
    }).exec((err,doc) => {
        if(err) return next(err);
        next({
            message:"成功",
            status:200,
            data:doc
        })
    });
});
//修改密码
router.post("/rePassword",isLogin,(req,res,next) => {
    if(req.body.oldPassword === req.user_info.password){
        UserModel.update({_id:req.user_id},{password:req.body.newPassword},(err,doc) => {
            if(err) return next(err);
            next({
                message:"密码修改成功!",
                status:200
            });
        });
    }else{
        next({
            message:"原密码输入错误",
            status:400
        });
    }
});
//收藏文章
router.post("/collect",isLogin,(req,res,next) => {
    async function a(){
        try{
            let articleDoc = await ArticleModel.findOne({_id:req.body.id}).populate({
                path:"collected",
                match:{
                    _id:{
                        $all:[req.user_id]
                    }
                }
            }).exec();
            return articleDoc;
        }catch(err){
            return err;
        }
    }
    a().then(o => {
        if(!o){
            return next({
                message:"文章信息不存在！",
                status:400
            });
        }
        if(o.collected.length){
            ArticleModel.update({
                _id:o._id
            },{
                $pull:{
                    collected:req.user_id
                }
            },err => {
                if(err) return next(err);
                next({
                    message:"取消成功！",
                    status:200
                });
            });
        }else{
            o.collected.push(req.user_id);
            o.save(err => {
                if(err) return next(err);
                next({
                    message:"收藏成功！",
                    status:200
                });
            });
        }
    }).catch(err => {
        next(err);
    });
});
//是否收藏
router.post("/isCollect",isLogin,(req,res,next) => {
    async function a(){
        try{
            let articleDoc = await ArticleModel.findOne({_id:req.body.id}).populate({
                path:"collected",
                match:{
                    _id:{
                        $all:[req.user_id]
                    }
                }
            }).exec();
            return articleDoc;
        }catch(err){
            return err;
        }
    }
    a().then(o => {
        if(!o){
            return next({
                message:"文章信息不存在！",
                status:400
            });
        }
        if(o.collected.length){
            next({
                message:"已收藏",
                status:200,
                data:1
            });
        }else{
            next({
                message:"未收藏",
                status:200,
                data:0
            });
        }
    }).catch(err => {
        next(err);
    })
});
//用户收藏列表
router.post("/collections",isLogin,(req,res,next) => {
    let reg = new RegExp(req.body.keywords,"i");
    let query = {
        $or:[{
            title:reg
        },{
            intro:reg
        },{
            content:reg
        }],
        collected:{
            $all:[req.user_id]
        }
    };
    let page = req.body.page || 1;
    let size = Number(req.body.size || 20);
    pageObj.normal(page,size,{collected:0},ArticleModel,{path:"user",select:["nickname"]},query,{}).then(arr => {
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
//未读评论条数
router.post("/unRead",isLogin,(req,res,next) => {
    CommentModel.count({
        user:req.user_id,
        isRead:false
    }).exec((err,count) => {
        if(err) return next(err);
        next({
            message:"成功",
            status:200,
            data:count
        });
    });
});
//未读状态变更
router.post("/read",isLogin,(req,res,next) => {
    CommentModel.update({
        user:req.user_id
    },{
        isRead:true
    },{
        multi:true  //更新全部查询结果
    },(err,doc) => {
        if(err) return next(err);
        next({
            message:"成功",
            status:200
        });
    });
});
//最新评论
router.post("/comments",isLogin,(req,res,next) => {
    let query = {
        user:req.user_id
    };
    let page = req.body.page || 1;
    let size = Number(req.body.size || 20);
    pageObj.normal(page,size,{},CommentModel,[{
        path:"article",
        select:["title"]
    },{
        path:"userBy",
        select:["nickname"]
    }],query,{createTime:-1}).then(data => {
        next({
            message:"成功",
            status:200,
            page:data[0],
            data:data[1]
        });
    }).catch(err => {
        next(err);
    })
});
//我的评论
router.post("/myComments",isLogin,(req,res,next) => {
    let query = {
        userBy:req.user_id
    };
    let page = req.body.page || 1;
    let size = Number(req.body.size || 20);
    pageObj.normal(page,size,{},CommentModel,[{
        path:"article",
        select:["title"]
    },{
        path:"userBy",
        select:["nickname"]
    }],query,{createTime:-1}).then(data => {
        next({
            message:"成功",
            status:200,
            page:data[0],
            data:data[1]
        });
    }).catch(err => {
        next(err);
    })
});


module.exports = router;