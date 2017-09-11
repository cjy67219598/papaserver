let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");
let pageQuery = require("./utils/page");


/* GET home page. */
router.post("/detail", (req, res, next) => {
    ArticleModel.findOne({_id: req.body.id}, (err, doc) => {
        try {
            if (err) return next(err);
            let obj = {
                message: "成功！",
                status: 200,
                data:doc
            };
            next(obj);
        }catch(err){
            next(err);
        }
    });
});

router.post("/hot",(req,res,next) => {
    ArticleModel.find({}).populate("user",["nickname"]).sort({counts:-1}).limit(20).exec((err,doc) => {
        try{
            if(err) return next(err);
            let obj = {
                message:"成功！",
                status:200,
                data:doc
            };
            next(obj);
        }catch(err){
            next(err);
        }
    });
});

router.post("/latest",(req,res,next) => {
    let page = req.body.page || 1;
    let size = Number(req.body.size || 10);
    pageQuery.normal(page,size,ArticleModel,{path:"user",select:["nickname"]},{},{updateTime:-1}).then(arr => {
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