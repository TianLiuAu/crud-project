import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Router from 'vue-router'
import Login from '../components/pages/Login'
import Dashboard from '../components/dashboard/dashboard'
import Modules from '../components/dashboard/modules'
import Register from '../components/pages/Registe'
import Favorite_Modules from '../components/dashboard/favorite_modules'
import Like_Button_Module from '../components/dashboard/like_module'


Vue.use(Router);
Vue.use(VueAxios, axios);

export default new Router({
    routes: [
        {
            path: '*',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Dashboard,
            children: [
                {
                    path: 'modules',
                    name: 'Modules',
                    component: Modules,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'favorite',
                    name: 'Favorite',
                    component: Favorite_Modules,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'likebutton',
                    name: 'LikeButton',
                    component: Like_Button_Module,
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        }

    ]
})