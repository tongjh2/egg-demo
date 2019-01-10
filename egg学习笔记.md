### 快速初始化

生成项目（要求最低的node版本8.x）

```
npm i egg-init -g
egg-init egg-example --type=simple
cd egg-example
npm i
```

启动项目

```
npm run dev
```

### 配置

环境配置会覆盖默认配置

```
config
|- config.default.js 默认配置
|- config.prod.js    线上环境测试
|- config.unittest.js  测试环境配置
`- config.local.js 本地开发环境配置
```

+ 相关配置 config.default.js

```

```

### 模板渲染


安装`egg-view-nunjucks`来渲染模板

```
npm i egg-view-nunjucks --save
```

开启插件：

```
// config/plugin.js
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks'
};
```


```
// config/config.default.js
module.exports = appInfo => {

	........

	// 添加view配置
    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    };

  	return config;
};
```



### MySQL

安装`egg-mysql`

```
npm i --save egg-mysql
```

开启插件

```
exports.mysql = {
	enable:true,
	package:'egg-mysql',
}
```



`config/config.local.js` 中配置本地开发环境mysql

```
module.exports = appInfo => {
    const config = exports = {};

	……

    config.mysql = exports.mysql = {
        client: {
            host: '192.168.11.22',
            port: '3306',
            user: 'tongjh',
            password: '123456',
            database: 'tongjh_egg',
        },
        app: true,
        agent: false,
    }

  return config;
};
```

### Router

路由默认定义在`app/router.js`，避免路由规则散落在多个地方，从而出现未知冲突，太多路由映射也可以进行拆分，可直接使用` egg-router-plus`

```
module.exports = app => {
    const { router, controller } = app;

    router.get('/',controller.home.index);
    
    router.get('/user/list', controller.user.list);
    router.post('/user/add', controller.user.add);
    router.get('/user/item/:id', controller.user.item);
    router.put('/user/update', controller.user.update);
    router.delete('/user/delete/:id', controller.user.delete);

    router.get('/curl/get', controller.curl.get);
    router.get('/curl/post', controller.curl.post);
    router.get('/curl/put', controller.curl.put);
    router.get('/curl/delete',controller.curl.delete);
};
```

### Controller

Controller 层主要对用户的请求参数进行处理（校验、转换），然后调用对应的 service 方法处理业务，得到业务结果后封装并返回。所有Controller文件都必须放在`app/controller`目录下，支持多级目录，项目中的Controller类继承于`egg.Controller`，会有下面几个属性挂载在`this`上

+ this.ctx: 当前请求的上下文 Context 对象的实例，通过它我们可以拿到框架封装好的处理当前请求的各种便捷属性和方法。
+ this.app: 当前应用 Application 对象的实例，通过它我们可以拿到框架提供的全局对象和方法。
+ this.service：应用定义的 Service，通过它我们可以访问到抽象出的业务层，等价于 this.ctx.service 。
+ this.config：应用运行时的配置项。
+ this.logger：logger 对象，上面有四个方法（debug，info，warn，error），分别代表打印四个不同级别的日志，使用方法和效果与 context logger 中介绍的一样，但是通过这个 logger 对象记录的日志，在日志前面会加上打印该日志的文件路径，以便快速定位日志打印位置。

控制器中参数获取

```
this.ctx.params.id   //path 参数
this.ctx.query.id    //query 参数
this.ctx.queries		//query中重复的key接受
this.ctx.request.body.id //body 参数
this.ctx.headers  //header参数
this.ctx.get(name) //获取请求header中的一个字段的值
this.ctx.cookies.get(name) //获取cookie参数
this.ctx.session.userId //获取session参数
```

Controller例子

```
const Controller = require('egg').Controller;

class UserController extends Controller {

    async index() {
        let params = {
            page: this.ctx.query.page || 1,
            pageSize: this.ctx.query.pageSize || 10,
            q: this.ctx.query.q,
            orders: [['id', 'desc']],
            columns: ['id', 'name', 'password','age']
        }
        console.log(params)
        const res = await this.ctx.service.user.list(params)
        await this.ctx.render('user-list.tpl',{list:res});
    }
    
    ......
   
}

module.exports = UserController;
```

### Service

在Service中使用mysql操作CURD

```
// app/service/user.js
const Service = require('egg').Service;

class UserService extends Service {

    async add(params={}){
        let res = await this.app.mysql.insert('user', params);
        return res;
    }

    async delete(id) {
        const res = await this.app.mysql.delete('user', { id: id });
        return res;
    }

    async update(params = {}) {
        const res = await this.app.mysql.update('user', params);
        return res;
    }

    async item(id=0){
        let res = await this.app.mysql.get('user',{id:id});
        return res;
    }

    async list(params={}){
        let pageSize = parseFloat(params.pageSize||'10');
        let offset = ((params.page || 1) - 1) * params.pageSize;

        let query = {
            limit: pageSize,
            offset:offset
        }

        let where = {};
        if( params.q ){
            where.name = params.q;
        }
        query.where = where;

        if( params.orders ){
            query.orders = params.orders;
        }

        if (params.columns ){
            query.columns = params.columns;
        }
        let res = await this.app.mysql.select('user',query);
        return res;
    }

    async query(sql, params) {
        const res = await this.app.mysql.query(sql,params)
        return res;
    }

}

module.exports = UserService;
```

### HttpClient

框架在`Context`中提供了`ctx.curl(url,options)`和`ctx.httpclient`来进行 HTTP 请求

```
// app/service/curl.js
const Service = require('egg').Service;

class CurlService extends Service{

    async get(){
        const res = await this.ctx.curl('https://httpbin.org/get?foo=bar', {
            dataType: 'json', // 自动解析 JSON response
            timeout: 3000, // 3 秒超时
        });
        return res;
    }

    async post(){
        const res = await this.ctx.curl('https://httpbin.org/post',{
            method: 'POST', // 必须指定 method
            contentType: 'json', // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            data: { // 传递参数
                hello:'world',
                now: Date.now(),
            },
            dataType: 'json' // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        });
        return res;
    }

    async put(){
        const res = await this.ctx.curl('https://httpbin.org/put',{
            method: 'PUT',
            contentType: 'json',
            data: {
                update: 'foo bar'
            },
            dataType: 'json'
        });
        return res
    }

    async delete(){
        const res = await this.ctx.curl('https://httpbin.org/delete',{
            method: 'DELETE',
            dataType:'json',
        })
        return res;
    }
    
}

module.exports = CurlService;
```

### 异常处理

在编写代码时，在所有地方都可以直接用 try catch 来捕获异常

框架通过`egg-onerror`插件提供了统一的错误处理机制，并提供了自定义统一异常处理机制

## 参考资料

> https://eggjs.org/zh-cn/tutorials/index.html