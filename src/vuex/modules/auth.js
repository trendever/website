import {
  RECEIVED_AUTH_DATA,
  SET_CALLBACK_ON_SUCCEESS_AUTH,
  CLEAR_CALLBACK_ON_SUCCEESS_AUTH,
} from '../mutation-types';


const state = {
  phone: null, // string
  username: null, // string
  instagram: true,
  callbackOnSuccess: null, // function
};

// mutations
const mutations = {
  [RECEIVED_AUTH_DATA] (state, { phone, username, instagram }) {
    state.phone = phone;
    state.username = username;
    state.instagram = instagram;
  },
  [SET_CALLBACK_ON_SUCCEESS_AUTH] (state, callback) {
    state.callbackOnSuccess = callback
  },
  [CLEAR_CALLBACK_ON_SUCCEESS_AUTH] (state) {
    state.callbackOnSuccess = null
  },
};

export default {
  state,
  mutations
};
