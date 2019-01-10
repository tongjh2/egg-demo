'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // 用于cookie签名密钥，应更改为您自己的并保持安全
  config.keys = appInfo.name + '_1544499009878_5127';

  // Middleware 中间件
  config.middleware = [];

  config.security = {
    csrf:{
      enable: false, //关闭csrf配置
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
      bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
      useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
      sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
    }
  }

  return config;
};
