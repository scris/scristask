import Vue from 'vue';
import Router from 'vue-router';
import register from '@/components/register';
import simpleui from '@/components/simpleui';

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/',
      name: 'register',
      component: register,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/list',
      name: 'simpleui',
      component: simpleui,
    },
  ],
});
