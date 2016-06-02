import {
  SHOW_POPUP_FAST_SIGNUP,
  HIDE_POPUP_FAST_SIGNUP,
} from '../mutation-types';

// initial state
const state = {
  showFastSignup: false,
};

// mutations
const mutations = {
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
