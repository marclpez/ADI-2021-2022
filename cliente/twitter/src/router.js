import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import Perfil from './views/Perfil.vue';
import DetallesTweet from './views/DetallesTweet.vue';
import LikesTweet from './views/LikesTweet.vue';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes:[
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/perfil',
            name: 'perfil',
            component: Perfil
        },
        {
            path: '/tweets/:id',
            name: 'DetallesTweet',
            component: DetallesTweet
        },
        {
            path: '/tweets/:id/likes',
            name: 'LikesTweet',
            component: LikesTweet
        },
        {
            path: '/Logout',
            name: 'logout',
            component: Logout
        }
    ]
})