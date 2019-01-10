const Service = require('egg').Service;

class UserService extends Service{

    async list(page){
        return [
            { id:2,name:'tongjh',age:22 },
            { id:4,name:'zhangsan',age:14 },
            { id:5,name:'lisi',age:28 },
            { id:7,name:'wangwu',age:25 }
        ]
    }
}

module.exports = UserService;