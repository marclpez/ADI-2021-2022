import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import store from './store';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, Axios)


new Vue({
  store,
  created(){
    console.log(localStorage.token)
    if(localStorage.token !== null){
      this.$store.state.logueado = true;
    }
    console.log(this.$store.state.logueado)
  },
  router,
  render: h => h(App),
}).$mount('#app')
