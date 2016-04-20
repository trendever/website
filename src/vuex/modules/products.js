import {
  RECEIVE_PRODUCTS,
  RECEIVE_MORE_PRODUCTS,
  WAIT_PRODUCTS_RESPONSE,
  RECEIVE_PRODUCTS_RESPONSE,
  OPEN_PRODUCT,
  ENABLE_INFINITY_PRODUCTS
} from '../mutation-types';

// initial state
const state = {
  all: [], // {object|array}
  opened: {
    product: {},
    cachedImages: false,
  },

  isWaitResponse: false,
  isInfinity: false,
};

// mutations
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products;
  },
  [RECEIVE_MORE_PRODUCTS] (state, products) {
    state.all = state.all.concat(products);
  },
  [OPEN_PRODUCT] (state, product, cachedImages) {
    state.opened = {product, cachedImages};
  },
  [WAIT_PRODUCTS_RESPONSE] (state) {
    state.isWaitResponse = true;
  },
  [RECEIVE_PRODUCTS_RESPONSE] (state) {
    state.isWaitResponse = false;
  },
  [ENABLE_INFINITY_PRODUCTS] (state) {
    state.isInfinity = true;
  },
};

export default {
  state,
  mutations
};