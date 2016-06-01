import {
  RECEIVE_PRODUCTS,
  RECEIVE_MORE_PRODUCTS,
  WAIT_PRODUCTS_RESPONSE,
  RECEIVE_PRODUCTS_RESPONSE,
  OPEN_PRODUCT,
  OPEN_LIST,
  ENABLE_HAS_MORE_PRODUCTS,
  DISABLE_HAS_MORE_PRODUCTS,
  ENABLE_INFINITY_PRODUCTS,
  SET_COLUMN_NUMBER,
} from '../mutation-types';

// initial state
const state = {
  lists: {
    // "profile": {
    //   products: [],
    //   isInfinity: true,
    //   hasMore: true,
    //   columnNumber: 0,
    //   isWaitResponse: false,
    // },
  },
  openedProduct: {},
  openedList: null,  // string name
};

// mutations
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.lists[state.openedList].products = products;
  },
  [RECEIVE_MORE_PRODUCTS] (state, products) {
    state.lists[state.openedList].products = state.lists[state.openedList].products.concat(products);
  },
  [OPEN_PRODUCT] (state, product) {
    state.openedProduct = product;
  },
  [OPEN_LIST] (state, name) {
    if (!state.lists[name]) {
      state.lists[name] = {
        products: [],
        isInfinity: true,
        hasMore: true,
        columnNumber: 0,
        isWaitResponse: true,
      }
    }
    state.openedList = name;
  },
  [WAIT_PRODUCTS_RESPONSE] (state) {
    state.lists[state.openedList].isWaitResponse = true;
  },
  [RECEIVE_PRODUCTS_RESPONSE] (state) {
    // state.lists[state.openedList].isWaitResponse = false;
  },
  [ENABLE_HAS_MORE_PRODUCTS] (state) {
    state.lists[state.openedList].hasMore = true;
  },
  [DISABLE_HAS_MORE_PRODUCTS] (state) {
    state.lists[state.openedList].hasMore = false;
  },
  [ENABLE_INFINITY_PRODUCTS] (state) {
    state.lists[state.openedList].isInfinity = true;
  },
  [SET_COLUMN_NUMBER] (state, columnNumber) {
    state.lists[state.openedList].columnNumber = columnNumber;
  },
};

export default {
  state,
  mutations
};
