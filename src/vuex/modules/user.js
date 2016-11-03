import {
  USER_AUTHENTICATED,
  USER_RECEIVE_PROFILE,
  USER_SET_PROFILE,
  USER_SET_MY_ID,
  USER_SET_PHOTOS_CONFIG,
  USER_CLOSE_PROFILE,
  USER_LOGOUT,
  USER_SET_MY_CURRENT_LIST,
  USER_SET_TOOLTIP,
  USER_SET_PAYMENT,
  USER_SET_USE_DAYS,
  USER_SET_SUPPLIER_STATUS,
  USER_SHOW_MENU
} from '../mutation-types';

// initial state
const state = {

  isAuth: false,
  token: null,
  id: null, // string - current profile
  myId: null, // Id profile of current user.
  all: {},
  photoConfigs: {},
  done: false,
  myCurrentList: 'product',
  tooltips:{
    profile: true,
    chats: true
  },
  payment: {},
  showMenu: false,

  //В будущем перенести лоадер в лучшее место
  showRootLoader: false,

  //Число оставшихся дней до окончания пробоного периода
  useDays: 7,

  //Ставится в зависимости от решения юзера начать продавать или нет
  supplierStatus: true

};

function picProfile( profile ) {

  return Object.assign(
    {
      id: profile.id,
      instagram_id: profile.instagram_id,
      instagram_username: profile.instagram_username,
      instagram_fullname: profile.instagram_fullname,
      avatar_url: profile.avatar_url || profile.instagram_avatar_url,
      caption: profile.caption || profile.instagram_caption,
      slogan: profile.slogan,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    },
    (profile.supplier_of) ?
    {
      supplier_of: profile.supplier_of
    }
      :
    {
      supplier_of: null
    }
    ,
    (profile.seller_of) ?
    {
      seller_of: profile.seller_of
    }
      :
    {
      seller_of: null
    },
    (profile.supplier) ?
    {
      has_email: profile.supplier.has_email,
      has_phone: profile.supplier.has_phone,
    }
      :
    {
      has_email: profile.has_email,
      has_phone: profile.has_phone,
    }
  )

}

// mutations
const mutations = {
  [USER_AUTHENTICATED] ( state, token ) {
    state.isAuth = true;
    state.token  = token;
  },
  [USER_SET_MY_ID] ( state, myId ) {
    state.myId = myId;
    state.id   = myId;
  },
  [USER_RECEIVE_PROFILE] ( state, profile, id = null ) {
    state.all = Object.assign( {}, state.all, { [(id !== null) ? id : profile.id]: picProfile( profile ) } );
  },
  [USER_SET_PROFILE] ( state, id = state.myId ) {
    if ( state.all.hasOwnProperty( id ) ) {
      state.id = id;
    }
    state.done = true;
  },
  [USER_SET_PHOTOS_CONFIG] ( state, listId, photoFilter, id = state.myId ) {
    if ( state.all.hasOwnProperty( id ) ) {
      state.photoConfigs = Object.assign( {}, state.photoConfigs, { [id]: { listId, photoFilter } } );
    } else {
      console.warn( `[ USER_SET_PHOTOS_CONFIG ] - profile with id: ${id}, not found.`, {
        state,
        listId,
        photoFilter,
        id
      } )
    }
  },
  [USER_CLOSE_PROFILE] ( state ) {
    state.id   = state.myId;
    state.done = false;
  },
  [USER_LOGOUT] ( state ){
    state.isAuth       = false;
    state.token        = null;
    state.id           = null; // string - current profile
    state.myId         = null; // Id profile of current user.
    state.all          = {};
    state.photoConfigs = {};
    state.done         = false;
  },
  [USER_SET_MY_CURRENT_LIST]( state , list ){
    state.myCurrentList = list;
  },
  [USER_SET_TOOLTIP](state, name, value) {
    state.tooltips[name] = value;
  },
  [USER_SET_PAYMENT](state,value){
    state.payment = value;
  },
  [USER_SET_USE_DAYS](state, count) {
    state.useDays = count;
  },
  [USER_SET_SUPPLIER_STATUS](state, disable) {
    state.supplierStatus = disable;
  },
  [USER_SHOW_MENU](state, value){
    state.showMenu = value;
  }
};

export default {
  state,
  mutations
};
