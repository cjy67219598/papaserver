let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let db = mongoose.createConnection("mongodb://localhost/papachen");
db.model("User",require("../models/user.model"));
db.model("Comment",require("../models/comment.model"));
db.model("Article",require("../models/article.model"));
db.on("error",err => {
    console.log(err);
});
db.once("open",() => {
    //一次打开记录
    console.log("正在访问数据库...");
});
db.on("connected", () => {
    console.log("数据库连接成功！");
});
db.on("disconnected", () => {
    console.log("数据库连接中断！");
});
module.exports = db;