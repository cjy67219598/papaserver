let express = require("express");
let router = express.Router();
let db = require("../models/config");
let UserModel = db.model("User");
let CommentModel = db.model("Comment");
let ArticleModel = db.model("Article");

/* GET home page. */
router.get("/", (req, res, next) => {
    res.send("hello world");
});

module.exports = router;