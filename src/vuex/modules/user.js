import {
  RECEIVE_CURRENT_USER,
  USER_AUTHENTICATED,
  RECEIVE_OPENED_PROFILE,
} from '../mutation-types';

// initial state
const state = {
  openedProfile: null, // dict with opened user

  isAuth: false,
  token: null,

  id: null, // string
  name: null,
  email: null,
  phone: null, // string
  has_email: false,
  has_phone: false,
  instagram_id: null, // string
  instagram_username: null,
  instagram_fullname: null,
  instagram_avatar_url: null,
  instagram_caption: null
};

// mutations
const mutations = {
  [USER_AUTHENTICATED] ( state, token ) {
    state.isAuth = true;
    state.token  = token;
  },
  [RECEIVE_CURRENT_USER] ( state, user ) {
    state.id = user.id;
    if ( user.supplier ) {
      state.has_email = user.supplier.has_email;
      state.has_phone = user.supplier.has_phone;
    } else {
      state.has_email = user.has_email;
      state.has_phone = user.has_phone;
    }
    state.instagram_id         = user.instagram_id;
    state.instagram_username   = user.instagram_username;
    state.instagram_fullname   = user.instagram_fullname;
    state.instagram_avatar_url = user.instagram_avatar_url;
    state.instagram_caption    = user.instagram_caption;
    state.name                 = user.name ;
    state.email                = user.email;
    state.phone                = user.phone;
  },
  [RECEIVE_OPENED_PROFILE] ( state, profile ) {
    state.openedProfile = profile;
  }
};

export default {
  state,
  mutations
};
