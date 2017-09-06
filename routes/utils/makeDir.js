/**
 * Created by Administrator on 2017/8/29.
 */
//创建文件夹，若存在直接执行回调，若不存在则先创建，再执行回调
let fs = require("fs");
let path = require("path");
let lastPath = null;
let dir = null;
function makeDir(p,cb){
    try{
        if(!dir) dir = p;
        fs.stat(p,function(err, stats){
            if(err){
                makeDir(path.resolve(p,"../"),cb);
                lastPath = p;
            }else{
                if(dir !== p){
                    fs.mkdir(lastPath,function(){
                        makeDir(dir,cb);
                    });
                }else{
                    cb();
                }
            }
        });
    }catch(err){
        cb(err);
    }
}
module.exports = makeDir;