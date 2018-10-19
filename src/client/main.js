/**
 * basic configuration for the frontend
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'

Vue.use(VueAxios, Axios);
Vue.config.productionTip = false;
Axios.defaults.withCredentials = true;

/**
 * create a new Vue instance for the frontend
 */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

/**
 * check user token to know if he can jump to next page
 */
router.beforeEach((to, from, next) => {
    console.log('to',to,'from',from, 'next', next);
    if (to.meta.requiresAuth){
      // to get verification from backend
      const API = 'http://127.0.0.1:3000/verify';
      try{
        var token = localStorage.getItem('token').slice(1,-1);
      }catch (e) {
          next({
              path: '/login'
          })
      }
      Axios.post(API,{token:token}).then((response) => {
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
