const Service = require('egg').Service;
const Cookies = require('cookies');


class CurlService extends Service{

    //curl get
    async get(params){
        const res = await this.ctx.curl('http://127.0.0.1:7001/user/list',{
            method: 'GET', //请求方法
            dataType:'json', //通过 contentType 告诉 HttpClient 以 JSON 格式发送
            data:params, //发送参数
            dataType:'json', //明确告诉 HttpClient 以 JSON 格式处理响应 body
            headers:{  //请求头
                'x-csrf-token':'token'
            }
        })
        return res.data;
    }

    //curl post
    async post(params){
        const res = await this.ctx.curl('http://127.0.0.1:7001/user/add',{
            method:'POST',
            contentType:'json',
            data:params,
            dataType:'json',
        })
        return res.data;
    }

    //curl put
    async put(params){
        const res = await this.ctx.curl('http://127.0.0.1:7001/user/update',{
            method:'PUT',
            contentType:'json',
            data:params,
            dataType:'json'
        });
        return res.data;
    }

    //curl delete
    async delete(params){
        const res = await this.ctx.curl('http://127.0.0.1:7001/user/'+params.id,{
            method: 'DELETE',
            dataType: 'json'
        });
        return res.data;
    }

}

module.exports = CurlService;