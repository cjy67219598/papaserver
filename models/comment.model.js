let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let GoodSchema = new Schema({
    user:{
        type:String,
        unique:true,
    },
    createTime:{
        type:String,
        default(){
            let a = new Date();
            return a.getTime();
        }
    }
});
let CommentSchema = new Schema({
    createTime:{
        type:String,
        default(){
            let a = new Date();
            return a.getTime();
        }
    },
    content:{
        type:String,
        validate(e){
            return e.length > 0 && e.length < 500;
        }
    },
    good:[GoodSchema],
    article:{
        type:Schema.Types.ObjectId,
        ref:"Article"
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports = CommentSchema;