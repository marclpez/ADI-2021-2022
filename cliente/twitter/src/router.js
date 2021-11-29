import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import Perfil from './views/Perfil.vue';
import DetallesTweet from './views/DetallesTweet.vue';
import LikesTweet from './views/LikesTweet.vue';
import Home from './views/Home.vue';
import Registro from './views/Registro.vue';
import Tweets from './views/Tweets.vue';
import Seguidores from './views/Seguidores.vue';
import Seguidos from './views/Seguidos.vue';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes:[
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
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
        },
        {
            path: '/Registro',
            name: 'registro',
            component: Registro
        },
        {
            path: '/Tweets',
            name: 'tweets',
            component: Tweets
        },
        {
            path: '/Seguidores',
            name: 'seguidores',
            component: Seguidores
        },
        {
            path: '/Seguidos',
            name: 'seguidos',
            component: Seguidos
        }
    ]
})