/* global Raven */
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueValidator from 'vue-validator';
import FastClick from 'fastclick';
import config from '../config';
import { throttleEvent } from 'utils';
import { configRouter } from './route-config';
import InitFilters from './filters';
import InitValidators from './validators';
require('es6-promise').polyfill();

// Log errors
if (config.raven.enabled) {
  Raven.config(config.raven.url).install();
  window.onerror = (errorMsg, url, lineNumber, colno, error) => {
    Raven.captureException(error);
  };
}


Vue.config.debug = config.debug;

Vue.use(VueValidator);

InitValidators();
InitFilters();

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
router.start(App, '#app');

// just for debugging
window.router = router;

// Init FastClick
FastClick.attach(document.body, {});

// Throttled events
throttleEvent("scroll", "optimizedScroll");
//throttleEvent("resize", "optimizedResize");
//