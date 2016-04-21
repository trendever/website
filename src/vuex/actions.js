import * as types from './mutation-types';
import * as products from 'services/products.js';
import * as leads from 'services/leads.js';
import * as chats from 'services/chat.js';
import * as messages from 'services/message.js';
import * as profile from 'services/profile.js';
import * as tagsService from 'services/tags';

// User

/**
 * Authenticate user
 * @param  {object} user             user data
 * @param  {string} token            auth token
 */
export const authenticateUser = ({ dispatch }, user, token) => {
  dispatch(types.USER_AUTHENTICATED, token);
  dispatch(types.RECEIVE_USER, user);
  profile.saveUser(user);
  profile.saveToken(token);
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

/**
 * Get leads (with cache)
 */
export const getAllLeads = ({ dispatch, state }) => {
  return new Promise((resolve) => {

    if (state.leads.all.length) {
      resolve(state.leads.all);
      return;
    }

    leads.find().then( data => {
      dispatch(types.RECEIVE_LEADS, data);
      resolve(data);
    });

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
export const receiveChatNotify = ({ dispatch, state }, chat_id) => {
  if (state.chat.opened_id !== chat_id) {
    dispatch(types.INCREMENT_CHAT_NOTIFY_COUNT);
  }
};
export const readedAllChatNotify = ({ dispatch }) => {
  dispatch(types.CLEAR_CHAT_NOTIFY_COUNT);
};

export const setOpenedChat = ({ dispatch, state }, chat_id) => {
  let chat = state.chat.all.find(obj => obj.id === chat_id);
  if (!chat) {return;}
  dispatch(types.OPEN_CHAT, chat.id);
};

/**
 * Get chat with history messages by id
 * @param  {number} chat_id
 */
export const getChat = ({ dispatch, state }, chat_id) => {
  return new Promise((resolve, reject) => {

    let chat = state.chat.all.find( obj => obj.id === chat_id );
    if (chat) {
      resolve(chat);
      return;
    }

    dispatch(types.CLOSE_OPENED_CHAT);

    function tryJoinToChat() {
      chats.join(chat_id).then(() => {
        this.getHistory();
      }).catch( error => {
        if (error === chats.ERROR_CODES.NOT_EXISTS) {
          reject(error);
        }
      });
    }

    function getHistory() {
      chats.history(chat_id).then( data => {

        let chat = {
          id: data.chat.id,
          members: data.chat.members,
          messages: data.messages,
        };
        dispatch(types.RECEIVE_CHAT, chat);
        resolve(chat);

      }).catch( error => {
        if (error.code === chats.ERROR_CODES.FORBIDDEN) {
          tryJoinToChat();
        } else if (error.code === chats.ERROR_CODES.NOT_EXISTS) {
          reject(error.code);
        }
      });
    }

    // ToDo delete it, if Igor added custom method for get lead
    if (!state.leads.all.length) {
      leads.find().then( data => {
        dispatch(types.RECEIVE_LEADS, data);
        getHistory();
      });
    } else {
      getHistory();
    }

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
      dispatch(types.RECEIVE_CHAT_MSG, data.chat.id, data.messages[0]);
      resolve(data.chat.id, data.messages[0]);
    }).catch( error => {
      reject(error);
    });

  });
};

