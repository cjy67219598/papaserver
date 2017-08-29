let express = require("express");
let path = require("path");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
//启动mongodb数据库
let db = require("./models/config");

let test = require("./routes/test");
let index = require("./routes/index");
let users = require("./routes/users");

let app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "favicon.png")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/test", test);
app.use("/index", index);
app.use("/users", users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {//捕捉404错误，传递给下一个路由
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) { //捕捉服务器错误（路由中的错误）
    console.log(err);
    // set locals, only providing error in development
    if (err.status === 200) {
        res.send({
            mes:{
                result:err.message || "成功",
                status:1
            }
        });
    }else if(err.status === 400){
        res.send({
            mes:{
                result:err.message || "失败",
                status:0
            }
        });
    }else if(err.status === 404){
        res.locals.message = err.message;
        res.locals.error = err;
        res.locals.title = "出错啦！";
        res.status(err.status);
        // render the error page
        res.render("error");//返回错误信息至错误页面
    }else{
        res.send({
            mes:{
                result:"系统异常",
                status:0
            }
        });
    }
});

module.exports = app;