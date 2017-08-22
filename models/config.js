let mongoose = require("mongoose");
module.exports = function(){
    let db = mongoose.createConnection("mongodb://localhost/papachen", {
        replset:{
            poolSize:4
        }
    });
    require("../models/user.model");
    return db;
}