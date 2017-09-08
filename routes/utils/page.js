module.exports = {
    normal(page,size,model,populate,query,sort){
        let start = (page - 1) * size;
        page = Number(page || 1);
        size = Number(size || 10);
        let o = {
            page:page
        };
        return Promise.all([new Promise((resolve,reject) => {
            model.count(query).exec((err,count) => {
                if(err){
                    reject(err);
                }else{
                    o.count = count;
                    resolve(o);
                }
            });
        }),new Promise((resolve,reject) => {
            model.find(query).skip(start).limit(size).populate(populate).sort(sort).exec((err,doc) => {
                if(err){
                    reject(err);
                }else{
                    resolve(doc);
                }
            });
        })]);
    },
    pop(page,size,arr){
        let start = (page - 1) * size;
        let o = {
            page:page
        };
        return Promise.all([new Promise((resolve,reject) => {
            try{
                o.count = Math.ceil(arr.length / size);
                resolve(o);
            }catch(err){
                reject(err);
            }
        }),new Promise((resolve,reject) => {
            try{
                let a = arr.slice(start,start + size);
                resolve(a);
            }catch(err){
                reject(err);
            }
        })]);
    }
};