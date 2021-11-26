import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import Vuex from 'vuex';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuex);
Vue.use(VueAxios, Axios)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
