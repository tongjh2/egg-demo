const Controller = require('egg').Controller;

class UserController extends Controller{

    async list(){
        let page = this.ctx.query.page||1;
        let data = await this.ctx.service.user.list(page)
        this.ctx.body = data;
    }

    async item(){
        let id = this.ctx.params.id;
        let item = await this.ctx.service.user.item(id)
        this.ctx.body = item;
    }

    async add(){
        let user = this.ctx.request.body;
        console.log(user,'username')
        let res = await this.ctx.service.user.add(user)
        this.ctx.body = res;
    }

    async delete(){
        let id = this.ctx.params.id;
        let item = await this.ctx.service.user.delete(id)
        this.ctx.body = item;
    }

}

module.exports = UserController;