let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let UserSchema = new Schema({
    username:{
        type:String,
        unique:true,
        //字母开头允许字母数字下划线长度5-15
        match:/^[a-zA-z][a-zA-Z0-9_]{4,14}$/
    },
    tel:{
        type:String,
        match:/^1[34578]\d{9}$/
    },
    email:{
      type:String,
      validate(e){
          return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e) && e.length < 30;
      }
    },
    nickname:{
        type:String,
        validate(data){
            return /.{1,15}/.test(data);
        }
    },
    sex:{
        type:Number,
        default:1
    },
    password:{
        type:String,
        match:/^[a-zA-Z0-9_]{5,17}$/
    },
    createTime:{
        type:Number,
        default(){
            let a = new Date();
            return a.getTime();
        }
    },
    updateTime:{
        type:Number,
        default(){
            let a = new Date();
            return a.getTime();
        }
    },
    headImg:{
        type:String
    },
    introduction:{
        type:String
    },
    following:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }]
});
module.exports = UserSchema;