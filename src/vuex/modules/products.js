import {
  RECEIVE_PRODUCTS,
  RECEIVE_MORE_PRODUCTS,
  WAIT_PRODUCTS_RESPONSE,
  RECEIVE_PRODUCTS_RESPONSE,
  OPEN_PRODUCT,
  ENABLE_HAS_MORE_PRODUCTS,
  DISABLE_HAS_MORE_PRODUCTS,
  ENABLE_INFINITY_PRODUCTS,
  SET_COLUMN_NUMBER
} from '../mutation-types';

// initial state
const state = {
  all: [], // {object|array}
  opened: {
    product: {},
    cachedImages: false,
  },
  columnNumber: 0,
  isWaitResponse: false,
  isInfinity: true,
  hasMore: true,
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
  [ENABLE_HAS_MORE_PRODUCTS] (state) {
    state.hasMore = true;
  },
  [DISABLE_HAS_MORE_PRODUCTS] (state) {
    state.hasMore = false;
  },
  [ENABLE_INFINITY_PRODUCTS] (state) {
    state.isInfinity = true;
  },
  [SET_COLUMN_NUMBER] (state, columnNumber) {
    state.columnNumber = columnNumber;
  },
};

export default {
  state,
  mutations
};