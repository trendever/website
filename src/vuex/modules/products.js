import {
  PRODUCTS_RECEIVE,
  PRODUCTS_LOADING,
  PRODUCTS_UPDATE_LIKED_BY,
  PRODUCTS_SET_LIST_ID,
  PRODUCTS_SET_COLUMN_NUMBER,
  PRODUCTS_SET_SCROLL,
  PRODUCTS_SET_ANIMATE,
  PRODUCTS_FORCE_RECEIVE,
  PRODUCTS_SET_OPENED_PRODUCT,
  PRODUCTS_CLOSE,
  PRODUCTS_SET_CALL_BACK_AFTER_LOADING,
  PRODUCTS_SET_COME_BACK,
  PRODUCTS_SET_CONTAINER_WIDTH,
  PRODUCTS_RESET_SCROLL_BY_LIST_ID,
  PRODUCTS_SAVE_SCROLL_BY_PRODUCT,
  PRODUCTS_CHECK_AUTH_USER_PRODUCT
} from '../mutation-types';

import { getCountElementOnPage } from 'vuex/getters/products.js';

const columnCount = document.body.offsetWidth <= 750 ? 2 : 3;

const ITEMS_PER_PAGE = getCountElementOnPage( {
  products: {
    columnCount
  }
} );

// initial state
const state = {
  lists: {
    // "profile": {
    //   products: [],
    //   needLoadMore: false,
    //   animateShow: true,
    //   hasMore: true

    //   shift: 0, // Это сдвиг

    // Это нужно для запроса данных.
    //   isLoading: false,
    //   searchOptions: {},

    // Это данные о высоте строки, данные о текущем реальном скроле и id начала и конца данных на экране;
    //   scrollTop: 0,
    //   lastScrollTop: 0,
    //   rowHeight: 0,
    //   idStart: 0,
    //   idEnd: 0,

    // },
  },
  saveScrollByProduct: {},
  columnCount,
  listId: null,
  loading: true,
  ITEMS_PER_PAGE,
  openedProduct: null,
  callBackAfterLoading: () => {
  },
  comeBack: false,
  containerWidth: 0,
  authUserProduct: false
};

// mutations
const mutations = {

  [PRODUCTS_SAVE_SCROLL_BY_PRODUCT] ( state, scrollTop, productId ){

    state.saveScrollByProduct = Object.assign( {}, state.saveScrollByProduct, { [ productId ]: scrollTop } );

  },

  [PRODUCTS_SET_CONTAINER_WIDTH] ( state, width ){

    state.containerWidth = width;

  },

  [PRODUCTS_FORCE_RECEIVE] ( state, products ) {

    if ( state.listId !== null ) {

      state.lists = Object.assign(
        {},
        state.lists,
        {
          [ state.listId ]: {
            products: Array.isArray( products ) ? products : [],
            needLoadMore: false,
            animateShow: true,
            hasMore: Array.isArray( products ) ? products.length >= ITEMS_PER_PAGE / 3 : false,

            shift: 0,

            isLoading: false,
            searchOptions: {},

            scrollTop: 0,
            lastScrollTop: 0,
            rowHeight: 0,
            idStart: 0,
            idEnd: ITEMS_PER_PAGE

          }
        }
      );

    }

    state.loading = false;
  },

  [PRODUCTS_RECEIVE] ( state, products ) {

    if ( !state.lists.hasOwnProperty( state.listId ) ) {

      state.lists = Object.assign(
        {},
        state.lists,
        {
          [ state.listId ]: {

            products: [],
            needLoadMore: false,
            animateShow: true,
            hasMore: (Array.isArray( products )) ? products.length >= ITEMS_PER_PAGE / 3 : false,

            shift: 0,

            isLoading: false,
            searchOptions: {},

            scrollTop: 0,
            lastScrollTop: 0,
            rowHeight: 0,
            idStart: 0,
            idEnd: ITEMS_PER_PAGE

          }
        }
      )

    }

    if ( Array.isArray( products ) ) {

      state.lists[ state.listId ].hasMore  = products.length >= ITEMS_PER_PAGE / 3;
      state.lists[ state.listId ].products = state.lists[ state.listId ].products.concat( products );

    } else {

      state.lists[ state.listId ].hasMore = false;

    }

    state.loading = false;

  },

  [PRODUCTS_SET_LIST_ID] ( state, listId = null ) {

    if ( listId !== null ) {

      state.listId = listId;

    }

  },

  [PRODUCTS_SET_OPENED_PRODUCT] ( state, product ) {

    state.openedProduct = product;

  },

  [PRODUCTS_UPDATE_LIKED_BY] ( state, product, user, like ) {

    product = { id: product.id + '' , data: product };

    /**
     * Если я лайкнул я просто одного себя ставлю в liked_by.
     * Всё ровно сейчас необходимо каждый раз запрашивать объект продукта.
     * */

    if ( state.openedProduct !== null ) {

      if ( like ) {

        state.openedProduct = Object.assign( {}, state.openedProduct, {
          liked_by: [ user ]
        } );

      } else {

        state.openedProduct = Object.assign( {}, state.openedProduct, {
          liked_by: []
        } );

      }

    }

    if ( state.lists.hasOwnProperty( 'profile_trends' ) ) {

      const { products } = state.lists.profile_trends;

      if ( like ) {

        state.lists.profile_trends = Object.assign( {}, state.lists.profile_trends, {
          products: [ product ].concat( products )
        } )

      } else {

        const newProducts = [];

        for ( let i = 0; i < products.length; i++ ) {

          const { id } = products[ i ];

          if ( id !== product.id ) {

            newProducts.push( products[ i ] );

          }

        }

        state.lists.profile_trends = Object.assign( {}, state.lists.profile_trends, {
          products: newProducts
        } )

      }

    } else {

      if ( like ) {

        state.lists = Object.assign(
          {},
          state.lists,
          {
            [ 'profile_trends' ]: {

              products: [ Object.assign( {}, product ) ],
              needLoadMore: false,
              animateShow: true,
              hasMore: true,

              shift: 0,

              isLoading: false,
              searchOptions: {},

              scrollTop: 0,
              lastScrollTop: 0,
              rowHeight: 0,
              idStart: 0,
              idEnd: ITEMS_PER_PAGE

            }
          }
        )

      }

    }

  },

  [PRODUCTS_SET_COLUMN_NUMBER] ( state, columnNumber = 3 ) {

    state.columnCount = columnNumber;

  },

  [PRODUCTS_LOADING] ( state, loading = true ) {

    state.loading = loading;

  },

  [PRODUCTS_SET_CALL_BACK_AFTER_LOADING] ( state, callBack ){

    state.callBackAfterLoading = callBack;

  },

  [PRODUCTS_CLOSE] ( state ) {

    state.loading = true;

  },

  [PRODUCTS_RESET_SCROLL_BY_LIST_ID] ( state, listId ){

    if ( state.lists.hasOwnProperty( listId ) ) {

      state.lists[ listId ] = Object.assign( {}, state.lists[ listId ], {

        isLoading: false,
        searchOptions: {},

        scrollTop: 0,
        lastScrollTop: 0,
        rowHeight: 0,
        idStart: 0,
        idEnd: ITEMS_PER_PAGE

      } )

    }

  },

  [PRODUCTS_SET_SCROLL] ( state, options ) {

    if ( state.lists.hasOwnProperty( state.listId ) ) {

      for ( const key in options ) {

        if ( options.hasOwnProperty( key ) ) {

          if ( state.lists[ state.listId ].hasOwnProperty( key ) ) {

            state.lists[ state.listId ][ key ] = typeof options[ key ] === 'undefined' ?
              state.lists[ state.listId ][ key ] :
              options[ key ];

          }

        }

      }

    }

  },

  [PRODUCTS_SET_ANIMATE] ( state, animateShow = true, listId = state.listId ) {

    if ( state.lists.hasOwnProperty( listId ) ) {

      state.lists[ listId ].animateShow = animateShow;

    }

  },

  [PRODUCTS_SET_COME_BACK] ( state, comeBack = false ) {

    state.comeBack = comeBack;

  },
  [PRODUCTS_CHECK_AUTH_USER_PRODUCT](state, check = false){

    state.authUserProduct = check;

  }

};

export default {
  state,
  mutations
};
