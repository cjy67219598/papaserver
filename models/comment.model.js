let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let CommentSchema = new Schema({
    createTime: {
        type: Number,
        default() {
            let a = new Date();
            return a.getTime();
        }
    },
    content: {
        type: String,
        validate(e) {
            return e.length > 0 && e.length < 500;
        }
    },
    isRead: {
        type:Boolean,
        default:false
    },
    good: {
        type:Number,
        default:0
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
module.exports = CommentSchema;