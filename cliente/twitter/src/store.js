import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        idUsuario: null,
        username: null,
        email: null,
        password: null,
        logueado: false
    },
    mutations: {
        setAuthentication(state, status){
            state.logueado = status;
        },
        setIdUser(state, id){
            state.idUsuario = id;
        },
        setUsername(state, username){
            state.username = username;
        },
        setEmail(state, email){
            state.email = email;
        },
        setPassword(state, password){
            state.password = password;
        },
        logout(state){
            state.idUsuario = null,
            state.username = null,
            state.email = null,
            state.password = null,
            state.logueado = false
        }
    },
    plugins: [
        new VuexPersistence({
            storage: window.localStorage
        }).plugin
    ]
})