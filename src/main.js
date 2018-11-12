// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Routes from './router'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.prototype.$eventHub = new Vue(); // Global event bus

// Use packages
Vue.use(VueRouter)

// Register routes
const router = new VueRouter({
  routes: Routes,
  mode: 'history'
});

// If page isn't found
router.beforeEach((to, from, next) => {
  if(!to.matched.length) {
    next('/404');
  }
  else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
