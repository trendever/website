import * as types from '../mutation-types';
import * as products from 'services/products.js';

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
