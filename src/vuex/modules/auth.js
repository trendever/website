import {
  RECEIVED_AUTH_DATA,
} from '../mutation-types';

// initial state
const state = {
  phone: null, // string
  username: null, // string
  instagram: true,
};

// mutations
const mutations = {
  [RECEIVED_AUTH_DATA] (state, { phone, username, instagram }) {
    state.phone = phone;
    state.username = username;
    state.instagram = instagram;
  },
};

export default {
  state,
  mutations
};