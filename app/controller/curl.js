const Controller = require('egg').Controller;

class CurlController extends Controller{

    async get(){
        let res = await this.ctx.service.curl.get({page:99});
        this.ctx.body = res.data;
    }

    async post(){
        let res = await this.ctx.service.curl.post({ name:'tongjh',now:Date.now() })
        this.ctx.body = res;
    }

    async put(){
        let res = await this.ctx.service.curl.put({ name:'tongjh',now:Date.now() })
        this.ctx.body = res;
    }

    async delete(){
        let res = await this.ctx.service.curl.delete({ id:1 })
        this.ctx.body = res;
    }

}

module.exports = CurlController;