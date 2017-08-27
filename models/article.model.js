let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ArticleSchema = new Schema({
    title:{
        type:String,
        validate:function(e){
            return e.length > 0 && e.length < 30;
        }
    },
    content:{
        type:String,
        validate:function(e){
            return e.length > 0 && e.length < 10000;
        }
    },
    hidden:{
        type:Boolean,
        default:false
    },
    createTime:{
        type:String,
        default:function(){
            let a = new Date();
            return a.getTime();
        }
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    }]
});
module.exports = ArticleSchema;