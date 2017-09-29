let db = require("../../models/config");
let UserModel = db.model("User");
module.exports = (req, res, next) => {//检测用户是否登录的中间件
    if(req.cookies.username && req.cookies.password){
        UserModel.findOne({username:req.cookies.username},(err,doc) => {
            try{
                if(err) return next(err);
                if(!doc){
                    err = new Error("用户登陆信息有误！");
                    err.status = 400;
                    next(err);
                }else if(req.cookies.password === doc.password){
                    req.user_id = doc._id;
                    req.user_info = doc;
                    next();
                }else{
                    err = new Error("用户登陆信息有误！");
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
}