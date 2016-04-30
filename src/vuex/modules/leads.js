import {
  RECEIVE_LEADS,
  RECEIVE_MORE_LEADS,
  WAIT_LEADS_RESPONSE,
  RECEIVE_LEADS_RESPONSE,
  RECEIVE_LEAD,
  LEADS_SET_TAB,
  CHANGED_LEAD_STATUS,
} from '../mutation-types';

// initial state
const state = {
  all: [],
  tab: "buy",
  isWaitResponse: false,
};

// mutations
const mutations = {
  [RECEIVE_LEADS] (state, leads) {
    state.all = leads;
  },
  [RECEIVE_MORE_LEADS] (state, leads) {
    state.all = state.all.concat(leads);
  },
  [WAIT_LEADS_RESPONSE] (state) {
    state.isWaitResponse = true;
  },
  [RECEIVE_LEADS_RESPONSE] (state) {
    state.isWaitResponse = false;
  },
  [RECEIVE_LEAD] (state, lead) {
    let updated = false;
    state.all.forEach( (obj, i) => {
      if (obj.id === lead.id) {
        state.all.$set(i, lead);
        updated = true;
      }
    });
    if (!updated) {
      state.all.push(lead);
    }
  },
  [LEADS_SET_TAB] (state, tab) {
    state.tab = tab;
  },
  [CHANGED_LEAD_STATUS] (state, lead_id, status_key) {
    state.all.map( lead => {
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