// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
//import cordova from './mobile-index' // open this line to build for Cordova, in other situations plz close it.

Vue.config.productionTip = false;
Vue.use(ElementUI);


//cordova.onDeviceReady = () => { // open this line to build for Cordova, in other situations plz close it.
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
//} // open this line to build for Cordova, in other situations plz close it.
//cordova.initialize(); // open this line to build for Cordova, in other situations plz close it.
