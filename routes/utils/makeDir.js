/**
 * Created by Administrator on 2017/8/29.
 */
//创建文件夹，若存在直接执行回调，若不存在则先创建，再执行回调
let fs = require("fs");
let path = require("path");

class MakeDir {
    constructor(p, cb) {
        this.dir = null;
        this.lastPath = null;
        this.make(p, cb);
    }

    make(p, cb) {
        try {
            if (!this.dir) this.dir = p;
            fs.stat(p, (err, status) => {
                try {
                    if (err) {
                        this.make(path.resolve(p, "../"), cb);
                        this.lastPath = p;
                    } else {
                        if (this.dir !== p) {
                            fs.mkdir(this.lastPath, (err) => {
                                if (err) return cb(err);
                                this.make(this.dir, cb);
                            });
                        } else {
                            cb();
                        }
                    }
                } catch (err) {
                    cb(err);
                }
            });
        } catch (err) {
            cb(err);
        }
    }
}

module.exports = MakeDir;