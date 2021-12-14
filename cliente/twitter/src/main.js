import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import store from './store';
import 'animate.css';
import VuePaginate from 'vue-paginate';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, Axios)
Vue.use(VuePaginate);



new Vue({
  store,
  created(){
    console.log(localStorage.token)
    if(localStorage.token !== null && localStorage.token !== undefined){
      this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
      this.$store.state.logueado = true;
    }
    else{
      this.$store.state.logueado = false;
    }
    console.log(this.$store.state.logueado)
  },
  router,
  render: h => h(App),
}).$mount('#app')

