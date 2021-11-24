import Vue from 'vue' 
import App from './App.vue'
import {router} from './router/index'
import Vuex from 'vuex';


Vue.use(Vuex);


new Vue({
    router,
    render: h => h(App)
}).mount('#app'); 