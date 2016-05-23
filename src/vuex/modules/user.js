import {
  USER_AUTHENTICATED,
  RECEIVE_USER,
} from '../mutation-types';

// initial state
const state = {
  isAuth: false,
  token: null,

  id: null, // string
  name: null,
  email: null,
  phone: null, // string
  instagram_id: null, // string
  instagram_username: null,
  instagram_fullname: null,
  instagram_avatar_url: null,
  instagram_caption: null
};

// mutations
const mutations = {
  [USER_AUTHENTICATED] (state, token) {
    // state.isAuth = true;
    // state.token = token;
  },
  [RECEIVE_USER] (state, user) {
    state.id = user.id;
    state.name = user.name;
    state.email = user.email;
    state.phone = user.phone;
    state.instagram_id = user.instagram_id;
    state.instagram_username = user.instagram_username;
    state.instagram_fullname = user.instagram_fullname;
    state.instagram_avatar_url = user.instagram_avatar_url;
    state.instagram_caption = user.instagram_caption;
  },
};

export default {
  state,
  mutations
};