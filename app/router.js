'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/curl/get',controller.curl.get);
  router.get('/curl/post',controller.curl.post);

  router.get('/user/list',controller.user.list);
  router.get('/user/item/:id',controller.user.item);
  router.post('/user/add',controller.user.add);
};
