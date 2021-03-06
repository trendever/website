import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/logger';
import config from '../../config';

// Modules
import auth from './modules/auth';
import user from './modules/user';
import leads from './modules/leads';
import conversation from './modules/conversation';
import products from './modules/products';
import search from './modules/search';


Vue.use(Vuex);
// Read it and use (when really nessesary!)
// http://vuejs.github.io/vuex/en/structure.html


export default new Vuex.Store({
  modules: {
    auth,
    user,
    conversation,
    leads,
    products,
    search,
  },
  strict: config.debug,
  middlewares: config.debug ? [createLogger()] : []
});
