import {
  RECEIVE_LEADS,
  LEADS_SET_TAB
} from '../mutation-types';

// initial state
const state = {
  all: [],
  tab: "buy",
};

// mutations
const mutations = {
  [RECEIVE_LEADS] (state, leads) {
    state.all = leads;
  },
  [LEADS_SET_TAB] (state, tab) {
    state.tab = tab;
  }
};

export default {
  state,
  mutations
};