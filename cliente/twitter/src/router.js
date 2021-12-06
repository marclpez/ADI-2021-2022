import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import MisTweets from './views/MisTweets.vue';
import DetallesTweet from './views/DetallesTweet.vue';
import LikesTweet from './views/LikesTweet.vue';
import Home from './views/Home.vue';
import Registro from './views/Registro.vue';
import Seguidores from './views/Seguidores.vue';
import Seguidos from './views/Seguidos.vue';
import DetallesUsuario from './views/DetallesUsuario.vue';
import NuevoPost from './views/NuevoPost.vue'
import EditPost from './views/EditPost.vue'
import EditUsuario from './views/EditUsuario.vue'
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
            path: '/usuarios/:id',
            name: 'detallesUsuario',
            component: DetallesUsuario,
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
            path: '/editarPerfil/:id',
            name: 'editUsuario',
            component: EditUsuario,
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
            path: '/misTweets',
            name: 'misTweets',
            component: MisTweets,
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
            path: '/nuevoPost',
            name: 'nuevoPost',
            component: NuevoPost,
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
            path: '/editarPost/:id',
            name: 'editarPost',
            component: EditPost,
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