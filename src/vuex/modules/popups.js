import {
  SHOW_POPUP_SIGNUP,
  HIDE_POPUP_SIGNUP,
  SHOW_POPUP_FAST_SIGNUP,
  HIDE_POPUP_FAST_SIGNUP,
} from '../mutation-types';

// initial state
const state = {
  showSignup: false,
  showFastSignup: false,
};

// mutations
const mutations = {
  [SHOW_POPUP_SIGNUP] (state) {
    state.showSignup = true;
  },
  [HIDE_POPUP_SIGNUP] (state) {
    state.showSignup = false;
  },
  [SHOW_POPUP_FAST_SIGNUP] (state) {
    state.showFastSignup = true;
  },
  [HIDE_POPUP_FAST_SIGNUP] (state) {
    state.showFastSignup = false;
  },

};

export default {
  state,
  mutations
};