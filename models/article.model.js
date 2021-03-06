let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ArticleSchema = new Schema({
    title: {
        type: String,
        validate(e) {
            return e.length > 0 && e.length < 30;
        }
    },
    content: {
        type: String,
        validate(e) {
            return e.length > 0 && e.length < 10000;
        }
    },
    intro: {
        type: String,
        default:"没有简介~",
        validate(e) {
            return e.length < 100;
        }
    },
    hidden: {
        type: Boolean,
        default: false
    },
    createTime: {
        type: Number,
        default() {
            let a = new Date();
            return a.getTime();
        }
    },
    updateTime: {
        type: Number,
        default() {
            let a = new Date();
            return a.getTime();
        }
    },
    category: {
        type: Number,
        default: 1
    },
    counts: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    collected: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});
module.exports = ArticleSchema;