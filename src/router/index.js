import Vue from 'vue';
import Router from 'vue-router';
import register from '@/components/register';
import mmain from '@/components/mmain';

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
      path: '/main',
      name: 'mmain',
      component: mmain,
    },
  ],
});
