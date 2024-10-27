import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import 'animate.css'
import Hero from "vue-hero";
import VueAnime from 'vue-animejs';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


Vue.use(Buefy);
Vue.use(VueAnime);
Vue.use(Hero);
Vue.use(VueToast);

import store from './store/store'

// styles
import '@/styles/main.scss';

// plugins
import plugins from '@/plugins/_plugins';

plugins();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
