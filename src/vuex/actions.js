/* globals Raven */
import * as types from './mutation-types';
import * as auth from 'services/auth';
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
