/* globals Raven */
import * as types from './mutation-types';
import * as auth from 'services/auth';
import * as userService from 'services/user';
import * as products from 'services/products.js';
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

    auth.signup(state.auth.phone, state.auth.username, state.auth.instagram)
    .then( () => {
      resolve(true);
    }).catch( error => {
      if (error === auth.ERROR_CODES.USER_ALREADY_EXISTS) {

        return auth.sendPassword(state.auth.phone).then( () => {
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
    dispatch(types.RECEIVE_CURRENT_USER, user);
    profile.saveUser(user);
  }
};

export const loadUser = ({ dispatch }) => {
  let _profile = profile.getProfile();
  if (_profile.token) {
    dispatch(types.USER_AUTHENTICATED, _profile.token);
  }
  if (_profile.user) {
    dispatch(types.RECEIVE_CURRENT_USER, _profile.user);
  }
};

/**
 * Open user or shop profile
 * @param  {number} id
 * @param  {string} instagram_username
 * @return {object} user
 */
export const openProfile = ({ dispatch, state }, { user_id, instagram_name }) => {
  return new Promise((resolve, reject) => {
    let openedProfile = state.user.openedProfile;

    if (!user_id && !instagram_name) {
      // Open profile current user
      if (state.user.instagram_username) {
        // instagram_name have more priority, for get shop if exist.
        instagram_name = state.user.instagram_username
      } else {
        // get user only
        user_id = state.user.id
      }
    }

    if (openedProfile) {
      if (user_id && openedProfile.User) {
        if (openedProfile.User.id === user_id) {
          resolve(state.user.openedProfile);
          return;
        }
      }
      if (instagram_name && openedProfile.Shop) {
        if (openedProfile.Shop.instagram_username === instagram_name) {
          resolve(openedProfile);
          return;
        }
      }
      if (instagram_name && openedProfile.User) {
        if (openedProfile.User.instagram_username === instagram_name) {
          resolve(openedProfile);
          return;
        }
      }
    }

    // Otherwise get from server
    userService.get({ user_id, instagram_name })
    .then( data => {
      dispatch(types.RECEIVE_OPENED_PROFILE, data);
      resolve(data);
      return;
    })
    .catch( error => {
      reject(error);
    });

  });
};
// export const closeUser = () => {
//   dispatch(types.CLEAR_OPENED_USER);
// };


// Products

/**
 * Get products and replace all
 * @param  {number} options.limit
 * @param  {number} options.offset
 * @param  {string} options.q              search in title
 * @param  {number|array} options.tags     products have tags
 */
export const getPartProducts = ({ dispatch, state }, { limit, offset, q, tags, instagram_name }) => {
  dispatch(types.WAIT_PRODUCTS_RESPONSE);

  products.find({ limit, offset, q, tags, instagram_name })
  .then( data => {
    dispatch(types.RECEIVE_PRODUCTS_RESPONSE);
    dispatch(types.RECEIVE_PRODUCTS, data.object_list);
    if (data.object_list) {
      if (!state.products.hasMore) {
        dispatch(types.ENABLE_HAS_MORE_PRODUCTS);
      }
    } else {
      dispatch(types.DISABLE_HAS_MORE_PRODUCTS);
    }
  });
};

/**
 * Get products and add to all
 * @param  {number} options.limit
 * @param  {number} options.offset
 * @param  {string} options.q              search in title
 * @param  {number|array} options.tags     products have tags
 */
export const getMoreProducts = ({ dispatch, state }, { limit, offset, from_id, direction,
                                                       q, tags, instagram_name }) => {
  dispatch(types.WAIT_PRODUCTS_RESPONSE);

  products.find({ limit, offset, from_id, direction,
                  q, tags, instagram_name })
  .then( data => {
    dispatch(types.RECEIVE_PRODUCTS_RESPONSE);
    if (data.object_list) {
      dispatch(types.RECEIVE_MORE_PRODUCTS, data.object_list);

      if (!state.products.hasMore) {
        dispatch(types.ENABLE_HAS_MORE_PRODUCTS);
      }
    } else {
      dispatch(types.DISABLE_HAS_MORE_PRODUCTS);
    }
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
      resolve({product: state.products.opened.product,
              cachedImages: true});
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
    .catch( (error) => {
      reject(error);
    });

  });
};

export const enableInfinityProducts = ({ dispatch }) => {
  dispatch(types.ENABLE_INFINITY_PRODUCTS);
};

export const setColumnNumber = ({ dispatch }, columnNumber) => {
  dispatch(types.SET_COLUMN_NUMBER, columnNumber);
};

// Search

export const setSearchValue = ({dispatch}, value) => {
  dispatch(types.SET_SEARCH_VALUE, value);
};

export const loadTags = ({dispatch, state}) => {
  let tags = state.search.selectedTags.map(tag => tag.id);
  dispatch(types.RECEIVE_TAGS, []);
  tagsService
    .find({tags})
    .then(tags => dispatch(types.RECEIVE_TAGS, tags));
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
