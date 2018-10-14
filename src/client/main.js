// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'


Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //router,
  router,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to, from, next) => {
    // ...
    console.log('to',to,'from',from, 'next', next);
    if (to.meta.requiresAuth){
      //console.log("It required Auth");
      const api = 'http://127.0.0.1:3000/verify';
      try{
        var token = localStorage.getItem('token').slice(1,-1);
      }catch (e) {
          //console.log(e);
          next({
              path: '/login'
          })
      }
      axios.post(api,{token:token}).then((response) => {
        if (response.data.success) {
          next();
        }else{
          next({
              path: '/login'
          })
        }
      })
    }else {
        next();
    }
});