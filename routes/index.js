let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");
let pageQuery = require("./utils/page");


/* GET home page. */
router.post("/detail", (req, res, next) => {
    ArticleModel.findOne({_id: req.body.id}).select({collected:0}).populate({path:"user",select:["nickname"]}).exec((err, doc) => {
        try {
            if (err) return next(err);
            if(req.body.view){
                doc.counts ++;
                doc.save(err => {
                    if(err) return next(err);
                    next({
                        message: "成功！",
                        status: 200,
                        data:doc
                    });
                });
            }else{
                next({
                    message: "成功！",
                    status: 200,
                    data:doc
                });
            }
        }catch(err){
            next(err);
        }
    });
});

router.post("/hot",(req,res,next) => {
    let reg = new RegExp(req.body.keywords,"i");
    let query = {
        $or:[{
            title:reg
        },{
            intro:reg
        },{
            content:reg
        }]
    };
    let page = req.body.page || 1;
    let size = Number(req.body.size || 20);
    pageQuery.normal(page,size,{collected:0},ArticleModel,{path:"user",select:["nickname"]},query,{counts:-1}).then(arr => {
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

router.post("/latest",(req,res,next) => {
    let page = req.body.page || 1;
    let size = Number(req.body.size || 10);
    pageQuery.normal(page,size,{collected:0},ArticleModel,{path:"user",select:["nickname"]},{},{updateTime:-1}).then(arr => {
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