const Controller = require('egg').Controller;

class UserController extends Controller{

    async list(){
        let page = this.ctx.query.page||1;
        let data = await this.ctx.service.user.list(page)
        this.ctx.body = data;
    }

    async item(){
        let id = this.ctx.query.id||1;
        let item = await this.ctx.service.user.item(id)
        this.ctx.body = item;
    }

    async add(){
        this.ctx.body = { message:'/user/add' };
    }

}

module.exports = UserController;