import * as types from '../mutation-types';
import * as products from 'services/products.js';

/**
 * Get products and replace all
 */
export const getPartProducts = ({ dispatch, state }, { limit, offset, q,
                                                             tags, instagram_name,
                                                             user_id }) => {
  return new Promise((resolve, reject) => {

    dispatch(types.WAIT_PRODUCTS_RESPONSE);

    products.find({ limit, offset, q, tags, instagram_name, user_id })
    .then( data => {
      dispatch(types.RECEIVE_PRODUCTS_RESPONSE)
      dispatch(types.RECEIVE_PRODUCTS, data.object_list)
      resolve(data.object_list)
      if (data.object_list) {
        if (!state.products.hasMore) {
          dispatch(types.ENABLE_HAS_MORE_PRODUCTS)
        }
      } else {
        dispatch(types.DISABLE_HAS_MORE_PRODUCTS)
      }
    })

  })

}

/**
 * Get products and add to all
 */
export const getMoreProducts = ({ dispatch, state }, { limit, offset, from_id,
                                                             direction, q, tags,
                                                             instagram_name, user_id }) => {
  return new Promise((resolve, reject) => {

    dispatch(types.WAIT_PRODUCTS_RESPONSE);

    products.find({ limit, offset, from_id, direction,
                    q, tags, instagram_name, user_id })
    .then( data => {
      dispatch(types.RECEIVE_PRODUCTS_RESPONSE);
      if (data.object_list) {
        dispatch(types.RECEIVE_MORE_PRODUCTS, data.object_list);

        if (!state.products.hasMore) {
          dispatch(types.ENABLE_HAS_MORE_PRODUCTS);
        }
        resolve(data.object_list)
      } else {
        dispatch(types.DISABLE_HAS_MORE_PRODUCTS);
        resolve([])
      }
    })

  })
};

/**
 * Open product by id
 * try get from state.feeds (like a cache)
 */
export const openProduct = ({ dispatch, state }, id) => {
  return new Promise((resolve, reject) => {

    if (state.products.openedProduct.id === id) {
      resolve(state.products.openedProduct);
      return;
    }

    // try get from cached
    var lists = state.products.lists
    if (lists) {
      for (let list of Object.keys(lists)) {
        if (lists[list]) {
          var product = lists[list].find( item => item.id === id);
          if (product) {
            dispatch(types.OPEN_PRODUCT, product);
            resolve(product);
            return;
          }
        }
      }
    }

    // Otherwise get from server
    // dispatch(types.WAIT_PRODUCTS_RESPONSE);
    products.get(id)
    .then( product => {
      // dispatch(types.RECEIVE_PRODUCTS_RESPONSE);
      dispatch(types.OPEN_PRODUCT, product);
      resolve(product);
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

export const openList = ({ dispatch }, name) => {
  dispatch(types.OPEN_LIST, name);
};
