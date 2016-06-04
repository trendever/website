import {
  PRODUCTS_RECEIVE,
  PRODUCTS_LOADING,
  PRODUCTS_SET_PRODUCT_ID,
  PRODUCTS_SET_LIST_ID,
  PRODUCTS_SET_HAS_MORE,
  PRODUCTS_SET_INFINITY,
  PRODUCTS_SET_COLUMN_NUMBER,
  PRODUCTS_SET_SCROLL_TOP,
  PRODUCTS_INC_LENGTH_LIST,
  PRODUCTS_SET_ANIMATE,
  PRODUCTS_FORCE_RECEIVE,
  PRODUCTS_CLOSE
} from '../mutation-types';

const ITEMS_PER_PAGE = 9;

// initial state
const state = {
  lists: {
    // "profile": {
    //   products: [],
    //   scrollTop: 0,
    //   lengthList: 9,
    //   isInfinity: true,
    //   hasMore: true,
    // },
  },
  columnCount: document.body.offsetWidth <= 750 ? 2 : 3,
  listId: null,
  productId: null,
  animateShow: true,
  loading: true,
  ITEMS_PER_PAGE
};

// mutations
const mutations = {

  [PRODUCTS_FORCE_RECEIVE] ( state, products ){

    if ( Array.isArray( products ) ) {

      if ( state.listId !== null ) {

        state.lists = Object.assign(
          {},
          state.lists,
          {
            [ state.listId ]: {
              products,
              scrollTop: 0,
              lengthList: ITEMS_PER_PAGE,
              isInfinity: true,
              hasMore: products.length >= ITEMS_PER_PAGE
            }
          }
        );

      }

    }
    state.loading = false;
  },
  [PRODUCTS_RECEIVE] ( state, products ) {

    if ( Array.isArray( products ) ) {

      if ( !state.lists.hasOwnProperty( state.listId ) ) {
        state.lists = Object.assign(
          {},
          state.lists,
          {
            [ state.listId ]: {
              products,
              scrollTop: 0,
              lengthList: ITEMS_PER_PAGE,
              isInfinity: true,
              hasMore: products.length >= ITEMS_PER_PAGE
            }
          }
        )
      } else {

        state.lists[ state.listId ].hasMore  = products.length >= ITEMS_PER_PAGE;
        state.lists[ state.listId ].products = state.lists[ state.listId ].products.concat( products );
        state.loading                        = false;

      }

    }

  },
  [PRODUCTS_SET_PRODUCT_ID] ( state, productId = null ) {

    if ( productId !== null ) {

      state.productId = productId;

    }

  },
  [PRODUCTS_SET_LIST_ID] ( state, listId = null ) {

    if ( listId !== null ) {

      state.listId = listId;

    }

  },
  [PRODUCTS_SET_COLUMN_NUMBER] ( state, columnNumber = 3 ) {

    state.columnCount = columnNumber;

  },
  [PRODUCTS_LOADING] ( state, loading = true ) {

    state.loading = loading;

  },
  [PRODUCTS_SET_HAS_MORE] ( state, hasMore = true ) {

    if ( state.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].hasMore = hasMore;

    }

  },
  [PRODUCTS_SET_INFINITY] ( state, isInfinity = true ) {

    if ( state.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].isInfinity = isInfinity;

    }

  },
  [PRODUCTS_SET_SCROLL_TOP] ( state, scrollTop = 0 ) {

    if ( state.lists.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].scrollTop = scrollTop;

    }

  },
  [PRODUCTS_INC_LENGTH_LIST] ( state ) {

    if ( state.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].lengthList += ITEMS_PER_PAGE;

    }

  },
  [PRODUCTS_SET_ANIMATE] ( state, animateShow = true ) {

    state.animateShow = animateShow;

  },
  [PRODUCTS_CLOSE] ( state ) {

    state.listId    = null;
    state.productId = null;
    state.loading   = true;

  }
};

export default {
  state,
  mutations
};
