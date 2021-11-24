import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes:[
        {
            path: '/Login',
            component: Login
        },
        {
            path: '/Logout',
            component: Logout
        }
    ]
})