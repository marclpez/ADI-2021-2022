import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Perfil from './views/Perfil.vue';
import DetallesTweet from './views/DetallesTweet.vue';
import LikesTweet from './views/LikesTweet.vue';
import Home from './views/Home.vue';
import Registro from './views/Registro.vue';
import Seguidores from './views/Seguidores.vue';
import Seguidos from './views/Seguidos.vue';
import Tweets from './views/Tweets.vue'
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
            component: Login,
            beforeEnter: (to, from, next) => {
                console.log(store.state.logueado)
                if(!store.state.logueado){
                    next()
                }
                else{
                    alert('Ya estás logueado')
                    next('/perfil');
                }
            }
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
            component: DetallesTweet,
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
            path: '/tweets/:id/likes',
            name: 'LikesTweet',
            component: LikesTweet,
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
            path: '/tweets',
            name: 'Tweets',
            component: Tweets,
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
            path: '/registro',
            name: 'registro',
            component: Registro,
            beforeEnter: (to, from, next) => {
                if(!store.state.logueado){
                    next()
                }
                else{
                    alert('Ya estás logueado')
                    next('/perfil');
                }
            }
        },
        {
            path: '/seguidores',
            name: 'seguidores',
            component: Seguidores,
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
            path: '/seguidos',
            name: 'seguidos',
            component: Seguidos,
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
        }
    ]
})