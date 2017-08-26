let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let CommentSchema = new mongoose.Schema({
    createTime:{
        type:String,
        default:function(){
            let a = new Date();
            return a.getTime();
        }
    },
    content:{
        type:String,
        validate:function(e){
            return e.length > 0 && e.length < 500;
        }
    },
    good:{
        type:Number,
        default:0
    },
    article:{
        type:Schema.Types.ObjectId,
        ref:"Article"
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
mongoose.model("Comment",CommentSchema);