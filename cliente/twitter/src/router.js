import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import Perfil from './views/Perfil.vue';
import DetallesTweet from './views/DetallesTweet.vue';
import LikesTweet from './views/LikesTweet.vue';
import Home from './views/Home.vue';
import Registro from './views/Registro.vue';
import Seguidores from './views/Seguidores.vue';
import Seguidos from './views/Seguidos.vue';
import store from './store'

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes:[
        {
            path: '/',
            redirect: {
                name: 'home'
            }
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
            component: Perfil,
            //Proteccion de rutas
            beforeEnter: (to, from, next) => {
                if(store.state.logueado){
                    next()
                }
                else{
                    alert('Debes loguearte antes')
                    next('/login');
                }
            }
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
            path: '/logout',
            name: 'logout',
            component: Logout
        },
        {
            path: '/registro',
            name: 'registro',
            component: Registro
        },
        {
            path: '/seguidores',
            name: 'seguidores',
            component: Seguidores
        },
        {
            path: '/seguidos',
            name: 'seguidos',
            component: Seguidos
        }
    ]
})