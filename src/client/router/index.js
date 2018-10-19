import Vue from 'vue'
import Axios from 'axios'
import Vue_Axios from 'vue-axios'
import Router from 'vue-router'
import Login from '../components/pages/login'
import Dashboard from '../components/dashboard/dashboard'
import Modules from '../components/dashboard/modules'
import Register from '../components/pages/register'
import Favorite_Modules from '../components/dashboard/favorite_modules'
import Like_Button_Module from '../components/dashboard/like_module'

//import package for router function
Vue.use(Router);
Vue.use(Vue_Axios, Axios);

//config the frontend router path information
export default new Router({
    routes: [
        {
            //for other pages all redirect to login
            path: '*',
            redirect: '/login'
        },
        {
            //for login, use login component
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            //if direct to dashboard, there're several child routing config with separate components
            path: '/admin',
            name: 'Admin',
            component: Dashboard,
            children: [
                {
                    //when user click "choose your module" button, direct to Modules
                    path: 'modules',
                    name: 'Modules',
                    component: Modules,
                    meta: { requiresAuth: true }
                },
                {
                    //when user click "Favoriate Module" button, direct to Favorite_Modules
                    path: 'favorite',
                    name: 'Favorite',
                    component: Favorite_Modules,
                    meta: { requiresAuth: true }
                },
                {
                    //when user click "Like your Module" button, direct to Like_Button_Module
                    path: 'likebutton',
                    name: 'LikeButton',
                    component: Like_Button_Module,
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            //for register, direct to register component
            path: '/register',
            name: 'Register',
            component: Register
        }

    ]
})
