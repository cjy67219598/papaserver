let express = require("express");
let path = require("path");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/",express.static(path.join(__dirname, "public")));

app.use("/main", index);
app.use("/users", users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {//捕捉404错误，传递给下一个路由
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) { //捕捉服务器错误（路由中的错误）
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;
  res.locals.title = "出错啦！";
  // render the error page
  res.status(err.status || 500);
  res.render("error");//返回错误信息至错误页面
});

module.exports = app;