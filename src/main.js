import Vue from 'vue';
import VueRouter from 'vue-router';
import VueTouch from 'vue-touch';
import VueValidator from 'vue-validator';
import FastClick from 'fastclick';
import config from '../config';
import { throttleEvent, isDebug } from 'utils';
import { configRouter } from './route-config';
import InitFilters from './filters';
import InitValidators from './validators';
import store from 'vuex/store';

require('es6-promise').polyfill();
require('core-js/fn/array/find');

// Log errors
if (config.raven.enabled) {
  var Raven = require('raven-js');
  Raven.config(config.raven.url, {
    maxMessageLength: 1000
  }).install();

  // Path console.debug, console.info, etc ...
  // console.error = Raven.captureException()
  require('raven-js/plugins/console')(
    Raven, console, {
      levels: ['debug', 'info', 'warn', 'error']
    });

  window.onerror = (errorMsg, url, lineNumber, colno, error) => {
    console.error(error, {extra: {
      user: store.state.user,
      converstation_id: store.state.converstation ? store.state.converstation.id : null,
      auth: store.state.auth
    }});
  };
}

window.mixpanel.init(config.mixpanel.token);
window.socket_url = config.socket_server.url;

Vue.config.debug = true;

Vue.use(VueValidator);

InitValidators();
InitFilters();

// add touch
Vue.use(VueTouch)

// install router
Vue.use(VueRouter);

// create router
const router = new VueRouter({
  history: true,
  saveScrollPosition: true,
  transitionOnLoad: false
});
window.history.scrollRestoration = 'manual';

// configure router
configRouter(router);

// bootstrap the app
const App = Vue.extend(require('./app.vue'));
router.start(App, 'app');

// Init FastClick
FastClick.attach(document.body, {});

// Throttled events
// throttleEvent('scroll', 'optimizedScroll');
throttleEvent('resize', 'optimizedResize');
