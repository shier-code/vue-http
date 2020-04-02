// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import ElementUI from 'element-ui';
// import axios from 'axios'



import App from './App'
import router from './router'

import 'babel-polyfill'
import util from './common/util'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n';
import store from './store'
import $ from 'jquery'
import api from './apis/index'
window.moment=require('moment')





Vue.prototype.$ajax=axios
Vue.config.productionTip = false
// Vue.use(ElementUI);
Vue.use(util);
Vue.use(Vuex);
Vue.use(api);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

