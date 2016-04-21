import {
  RECEIVE_LEADS,
  LEADS_SET_TAB,
  CHANGED_LEAD_STATUS,
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
  },
  [CHANGED_LEAD_STATUS] (state, lead_id, status_key) {
    state.all.forEach( lead => {
      if (lead.id === lead_id) {
        lead.status = status_key;
      }
    });
  }
};

export default {
  state,
  mutations
};