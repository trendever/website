import * as types from './mutation-types';
import * as auth from 'services/auth';
import * as products from 'services/products.js';
import * as leads from 'services/leads.js';
import * as chats from 'services/chat.js';
import * as messages from 'services/message.js';
import * as profile from 'services/profile.js';
import * as tagsService from 'services/tags';
import * as utils from 'utils';

// Auth

/**
 * Save auth data
 * Need for registration
 * @param  {string} options.phone
 * @param  {string} options.username
 * @param  {boolean} options.instagram   username is instagram username?
 */
export const saveAuthData = ({ dispatch }, { phone, username, instagram }) => {
  phone = phone ? utils.formatPhone(phone, true) : '';
  dispatch(types.RECEIVED_AUTH_DATA, { phone, username, instagram });
};

/**
 * User registration (with sms confirmation)
 * Params must be saved with actions.saveAuthData
 */
export const signup = ({ dispatch, state }) => {
  return new Promise((resolve, reject) => {
    let _data = {
      phone: state.auth.phone,
      username: state.auth.username,
      instagram: state.auth.instagram,
    };

    auth.signup(_data).then( () => {
      resolve(true);
    }).catch( error => {
      if (error === auth.ERROR_CODES.USER_ALREADY_EXISTS) {

        return auth.sendPassword({phone: state.auth.phone}).then( () => {
            resolve(true);
        }).catch( error => {
          console.log(error);
        });

      } else if (error === auth.ERROR_CODES.INCORRECT_PHONE_FORMAT) {
          return reject(error);
      }
      console.log(error);

    });

  });
};

// User

/**
 * Authenticate user
 * @param  {object} user             user data
 * @param  {string} token            auth token
 */
export const authenticateUser = ({ dispatch }, user, token) => {
  if (!profile.saveToken(token)) {
    return;
  }
  dispatch(types.USER_AUTHENTICATED, token);

  if (user) {
    // Note: If without user, need reload user data: loadUser()
    dispatch(types.RECEIVE_USER, user);
    profile.saveUser(user);
  }
};

export const loadUser = ({ dispatch }) => {
  let _profile = profile.getProfile();
  if (_profile.token) {
    dispatch(types.USER_AUTHENTICATED, _profile.token);
  }
  if (_profile.user) {
    dispatch(types.RECEIVE_USER, _profile.user);
  }
};

// Products

/**
 * Get products and replace all
 * @param  {number} options.limit
 * @param  {number} options.offset
 * @param  {string} options.q              search in title
 * @param  {number|array} options.tags     products have tags
 */
export const getPartProducts = ({ dispatch }, { limit, offset, q, tags }) => {
  dispatch(types.WAIT_PRODUCTS_RESPONSE);

  products.find({ limit, offset, q, tags })
  .then( data => {
    dispatch(types.RECEIVE_PRODUCTS_RESPONSE);
    dispatch(types.RECEIVE_PRODUCTS, data.object_list);
  });
};

/**
 * Get products and add to all
 * @param  {number} options.limit
 * @param  {number} options.offset
 * @param  {string} options.q              search in title
 * @param  {number|array} options.tags     products have tags
 */
export const getMoreProducts = ({ dispatch }, { limit, offset, q, tags }) => {
  dispatch(types.WAIT_PRODUCTS_RESPONSE);

  products.find({limit, offset, q, tags})
  .then( data => {
    dispatch(types.RECEIVE_PRODUCTS_RESPONSE);
    dispatch(types.RECEIVE_MORE_PRODUCTS, data.object_list);
  });
};


/**
 * Open product by id
 * try get from state.all (like a cache)
 * @param  {number} id
 * @return {object} object.product
 * @return {bool}   object.cached   will true, if from cache
 */
export const openProduct = ({ dispatch, state }, id) => {
  return new Promise((resolve, reject) => {

    if (state.products.opened.product.id === id) {
      resolve({product, cachedImages: true});
      return;
    }

    // try get from all cached
    var product = state.products.all.find( item => item.id === id);
    if (product) {
      dispatch(types.OPEN_PRODUCT, product, true);
      resolve({product, cachedImages: true});
      return;
    }

    // Otherwise get from server
    dispatch(types.WAIT_PRODUCTS_RESPONSE);
    products.get(id)
    .then( product => {
      dispatch(types.RECEIVE_PRODUCTS_RESPONSE);
      dispatch(types.OPEN_PRODUCT, product, false);
      resolve({product, cachedImages: false});
      return;
    })
    .catch( error => {
      reject(error);
    });

  });
};


export const enableInfinityProducts = ({ dispatch }) => {
  dispatch(types.ENABLE_INFINITY_PRODUCTS);
};

// Search

export const setSearchValue = ({dispatch}, value) => {
  dispatch(types.SET_SEARCH_VALUE, value);
};

export const loadTags = ({dispatch, state}) => {
  let tags = state.search.selectedTags.map(tag => tag.id);

  tagsService
    .find({tags})
    .then(tags => dispatch('RECEIVE_TAGS', tags));
};

export const selectTag = (store, tag) => {
  store.dispatch(types.SELECT_TAG, tag);
  loadTags(store);
};

export const removeTag = (store, tag) => {
  store.dispatch(types.REMOVE_TAG, tag);
  loadTags(store);
};


export const clearSearch = (store) => {
  store.dispatch(types.CLEAR_SEARCH);
  loadTags(store);
};

// Leads

export const createLead = ({ dispatch, state }, product_id) => {
  return new Promise((resolve, reject) => {

    leads.create(product_id).then( lead => {
      resolve(lead);
    }).catch( error => {
      if (error === leads.ERROR_CODES.UNATHORIZED) {
        return reject(error);
      }
      console.log(error);
    });

  });
};

/**
 * Get leads
 * @login_required
 */
export const getPartLeads = ({ dispatch }) => {
  return new Promise((resolve) => {
    dispatch(types.WAIT_LEADS_RESPONSE);

    leads.find({limit: 5}).then( data => {
      dispatch(types.RECEIVE_LEADS_RESPONSE);
      let leads_sell = data.seller.map( obj => {
        obj.type = 'sell';
        return obj;
      });
      let leads_buy = data.customer.map( obj => {
        obj.type = 'buy';
        return obj;
      });

      dispatch(types.RECEIVE_LEADS, leads_sell.concat(leads_buy));
      resolve(data);
    });

  });
};

export const getMoreLeads = ({ dispatch, state }) => {
  return new Promise((resolve) => {
    dispatch(types.WAIT_LEADS_RESPONSE);

    let roles = state.leads.tab === "buy" ? 'customer' : "seller,supplier";
    let _leads = state.leads.all.filter( obj => obj.type === state.leads.tab);
    if (!_leads) {return;}

    let from_lead_id = _leads[_leads.length - 1].id;

    leads.find({limit: 5, from_lead_id, roles}).then( data => {
      dispatch(types.RECEIVE_LEADS_RESPONSE);
      let leads = data.leads.map( (obj) => {
        obj.type = state.leads.tab;
        return obj;
      });

      dispatch(types.RECEIVE_MORE_LEADS, leads);
      resolve(leads);

    });

  });
};

/**
 * Get lead by lead_id or conversation_id (witch cache)
 * @param  {number} options.lead_id
 * @param  {number} options.conversation_id
 * @param  {bool} reset     if true, then get without cache
 */
export const getLead = ({ dispatch, state }, { lead_id, conversation_id , without_cache}) => {
  return new Promise((resolve, reject) => {
    // dispatch(types.CLOSE_OPENED_CHAT);

    if (!without_cache && state.leads.all.length) {
      let lead = state.leads.all.find( lead => lead.id === lead_id || lead.chat.id === conversation_id);
      if (!lead) {
        return;
      }
      return resolve({lead});
    }

    // Otherwise get from server
    function _getLead() {
      leads.get({ lead_id, conversation_id }).then( data => {
        let role = data.lead.chat.members.find( obj =>  obj.user_id === state.user.id ).role;
        if (role === leads.USER_ROLES.CUSTOMER.key) {
          data.lead.type = 'buy';
        } else {
          data.lead.type='sell';
        }
        dispatch(types.RECEIVE_LEAD, data.lead);

        // Save chat
        let _chat = {
          id: data.lead.chat.id,
          members: data.lead.chat.members,
          messages: data.messages,
        };
        dispatch(types.RECEIVE_CHAT, _chat);

        resolve(data);
      }).catch( error => {
        if (error.code === chats.ERROR_CODES.FORBIDDEN) {
          tryJoinToChat();
        } else if (error.code === chats.ERROR_CODES.NOT_EXISTS) {
          reject(error.code);
        }
      });
    }

    function tryJoinToChat() {
      chats.join({ lead_id, conversation_id }).then(() => {
        _getLead();
      }).catch( error => {
        if (error === chats.ERROR_CODES.NOT_EXISTS) {
          reject(error);
        }
      });
    }

    _getLead();

  });
};

export const setLeadStatus = ({ dispatch, state }, lead_id, event) => {
  return new Promise((resolve, reject) => {

    leads.setEvent(lead_id, event).then( (lead) => {
      dispatch(types.CHANGED_LEAD_STATUS, lead.id, lead.status);
      resolve(lead);
    }).catch( error => {
      reject(error);
    });

  });
};

export const receiveChangedStatusNotify = ({ dispatch }, lead_id, status_key) => {
  dispatch(types.CHANGED_LEAD_STATUS, lead_id, status_key);
};

/**
 * Set tab on lead list page
 * @param  {string} tab              buy or sell
 */
export const leadsSetTab = ({ dispatch }, tab) => {
  dispatch(types.LEADS_SET_TAB, tab);
};


// Chat
export const receiveChatNotify = ({ dispatch, state }, chatId, messages) => {
  dispatch(types.RECEIVE_CHAT_MSG, chatId, messages[0]);

  if (state.chat.opened_id !== chatId) {
    dispatch(types.INCREMENT_CHAT_NOTIFY_COUNT);
  }
};

export const readedAllChatNotify = ({ dispatch }) => {
  dispatch(types.CLEAR_CHAT_NOTIFY_COUNT);
};

export const setOpenedChat = ({ dispatch, state }, chat_id) => {
  // let chat = state.chat.all.find(obj => obj.id === chat_id);
  // if (!chat) {return;}
  dispatch(types.OPEN_CHAT, chat_id);
};

/**
 * Get chat with history messages by id
 * @param  {number} chat_id
 */
export const getChat = ({ dispatch, state }, chat_id) => {
  return new Promise((resolve, reject) => {

    // let chat = state.chat.all.find( obj => obj.id === chat_id );
    // if (chat) {
    //   resolve(chat);
    //   return;
    // }

    dispatch(types.CLOSE_OPENED_CHAT);

    function _getLead() {
      leads.get({ conversation_id: chat_id }).then( data => {

        let _chat = {
          id: data.lead.chat.id,
          members: data.lead.chat.members,
          messages: data.messages,
        };
        dispatch(types.RECEIVE_CHAT, _chat);

        resolve(_chat);

      }).catch( error => {
        if (error.code === chats.ERROR_CODES.FORBIDDEN) {
          tryJoinToChat();
        } else if (error.code === chats.ERROR_CODES.NOT_EXISTS) {
          reject(error.code);
        }
      });
    }

    function tryJoinToChat() {
      chats.join({ conversation_id: chat_id }).then(() => {
        _getLead();
      }).catch( error => {
        if (error === chats.ERROR_CODES.NOT_EXISTS) {
          reject(error);
        }
      });
    }

    // init
    _getLead();
  });
};

/**
 * Create message in chat
 * @param  {number} conversation_id  chat_id
 * @param  {string} text             text of message
 * @param  {string} mime_type        type of message (text/plain, text/json)
 */
export const createChatMsg = ({ dispatch, state }, conversation_id, text, mime_type) => {
  return new Promise((resolve, reject) => {

    messages.create(conversation_id, text, mime_type).then( data => {
      resolve(data.chat.id, data.messages[0]);
    }).catch( error => {
      reject(error);
    });

  });
};

export const setMessageRead = ({dispatch}, {id, members}) => dispatch(types.UPDATE_CHAT_MEMBERS, id, members);

// Popups

export const showPopupSignup = ({ dispatch }) => {
  dispatch(types.SHOW_POPUP_SIGNUP);
};

export const hidePopupSignup = ({ dispatch }) => {
  dispatch(types.HIDE_POPUP_SIGNUP);
};

export const showPopupFastSignup = ({ dispatch }) => {
  dispatch(types.SHOW_POPUP_FAST_SIGNUP);
};

export const hidePopupFastSignup = ({ dispatch }) => {
  dispatch(types.HIDE_POPUP_FAST_SIGNUP);
};