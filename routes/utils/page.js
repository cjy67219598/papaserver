module.exports = {
    normal(page,size,select,model,populate,query,sort){
        page = Number(page || 1);
        size = Number(size || 10);
        let start = (page - 1) * size;
        let o = {
            page:page
        };
        return Promise.all([new Promise((resolve,reject) => {
            model.count(query).exec((err,count) => {
                if(err){
                    reject(err);
                }else{
                    o.totalPage = Math.ceil(count / size);
                    o.count = count;
                    resolve(o);
                }
            });
        }),new Promise((resolve,reject) => {
            model.find(query).skip(start).limit(size).select(select).populate(populate).sort(sort).exec((err,doc) => {
                if(err){
                    reject(err);
                }else{
                    resolve(doc);
                }
            });
        })]);
    },
    pop(model,page,size,path,select,sort){
        page = Number(page || 1);
        size = Number(size || 10);
        let start = (page - 1) * size;
        return new Promise((resolve,reject) => {
            model.populate({
                path:path,
                select:select,
                options:{
                    limit:size,
                    skip:start
                },
                sort:sort
            }).exec((err,doc) => {
                if(err) reject(err);
                resolve(doc);
            });
        });
    }
};