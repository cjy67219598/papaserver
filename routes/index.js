let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");


/* GET home page. */
router.post("/detail", (req, res, next) => {
    ArticleModel.findOne({_id: req.body.id}, (err, doc) => {
        if (err) return next(err);
        let obj = {
            message: "成功！",
            status: 200,
            data:doc
        };
        next(obj);
    });
});

module.exports = router;