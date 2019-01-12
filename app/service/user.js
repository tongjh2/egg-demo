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

    async item(id=0){
        let res = await this.app.mysql.get('user',{id:id});
        return res;
    }

    async add(user){
        let res = await this.app.mysql.insert('user',user)
        return res;
    }

    async delete(id=0){
        let res = await this.app.mysql.delete('user',{id:id});
        return res;
    }
}

module.exports = UserService;