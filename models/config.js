let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let db = mongoose.createConnection("mongodb://localhost/papachen");
db.model("User",require("../models/user.model"));
db.model("Comment",require("../models/comment.model"));
db.model("Article",require("../models/article.model"));
module.exports = db;