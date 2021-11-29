import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        idUser: '',
        username: '',
        password: '',
        logueado: false
    },
    mutations: {
        setAuthentication(state, status){
            state.logueado = status;
        }
    }
})