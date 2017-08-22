let mongoose = require("mongoose");
let UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        //字母开头允许字母数字下划线长度5-15
        match:/^[a-zA-z][a-zA-Z0-9_]{4,14}$/,
        default:"isUsed"
    },
    nickname:{
        type:String,
        validate:function(data){
            return data.length >= 1 && data.length <= 15
        }
    },
    password:{
        type:String,
        match:/^[a-zA-Z0-9_]{5,17}$///字母数字下划线长度6-18
    },
    createTime:{
        type:String,
        default:function(){
            let a = new Date();
            return a.getTime();
        }
    },
    headImg:{
        type:String,
        default:"/upload/default.jpg"
    }
});
mongoose.model("User",UserSchema);