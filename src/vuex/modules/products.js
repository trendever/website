import {
  PRODUCTS_RECEIVE,
  PRODUCTS_LOADING,
  PRODUCTS_UPDATE_LIKED_BY,
  PRODUCTS_SET_LIST_ID,
  PRODUCTS_SET_INFINITY,
  PRODUCTS_SET_COLUMN_NUMBER,
  PRODUCTS_SET_SCROLL,
  PRODUCTS_INC_LENGTH_LIST,
  PRODUCTS_SET_ANIMATE,
  PRODUCTS_FORCE_RECEIVE,
  PRODUCTS_SET_OPENED_PRODUCT,
  PRODUCTS_CLOSE
} from '../mutation-types';

const ITEMS_PER_PAGE = 9;

// initial state
const state = {
  lists: {
    // "profile": {
    //   products: [],
    //   scrollTop: 0,
    //   scrollHeight: 0,
    //   lengthList: 9,
    //   isInfinity: true,
    //   animateShow: true,
    //   hasMore: true,
    // },
  },
  columnCount: document.body.offsetWidth <= 750 ? 2 : 3,
  listId: null,
  loading: true,
  ITEMS_PER_PAGE,
  openedProduct: null
};

// mutations
const mutations = {

  [PRODUCTS_FORCE_RECEIVE] ( state, products ) {

    if ( state.listId !== null ) {

      state.lists = Object.assign(
        {},
        state.lists,
        {
          [ state.listId ]: {
            products: Array.isArray( products ) ? products : [],
            scrollTop: 0,
            scrollHeight: 0,
            lengthList: ITEMS_PER_PAGE,
            isInfinity: true,
            animateShow: true,
            hasMore: Array.isArray( products ) ? products.length >= ITEMS_PER_PAGE : false
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
            scrollTop: 0,
            scrollHeight: 0,
            lengthList: ITEMS_PER_PAGE,
            isInfinity: true,
            animateShow: true,
            hasMore: (Array.isArray( products )) ? products.length >= ITEMS_PER_PAGE : false
          }
        }
      )

    }

    if ( Array.isArray( products ) ) {

      state.lists[ state.listId ].hasMore  = products.length >= ITEMS_PER_PAGE;
      state.lists[ state.listId ].lengthList += products.length;
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

    /*    if ( state.openedProduct !== null ) {

     if ( state.openedProduct.hasOwnProperty( 'liked_by' ) ) {

     const foundUser = state.openedProduct.liked_by.find( ( { id } ) => {

     return id === user.id;

     } );

     if ( typeof foundUser === 'undefined' ) {

     state.openedProduct = Object.assign(
     {},
     state.openedProduct,
     {
     liked_by: state.openedProduct.liked_by.concat( [ user ] )
     }
     );

     } else {

     if ( !like ) {

     const liked_by = [];

     state.openedProduct.liked_by.forEach( ( userItem ) => {

     if ( userItem.id !== user.id ) {
     liked_by.push( userItem );
     }

     } );

     state.openedProduct = Object.assign( {}, state.openedProduct, {
     liked_by
     } );

     }

     }

     } else {

     state.openedProduct = Object.assign( {}, state.openedProduct, {
     liked_by: [ user ]
     } );

     }

     }*/

    if ( state.lists.hasOwnProperty( 'profile' ) ) {

      const { products } = state.lists.profile;

      if ( like ) {

        state.lists.profile = Object.assign( {}, state.lists.profile, {
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

        state.lists.profile = Object.assign( {}, state.lists.profile, {
          products: newProducts
        } )

      }

    } else {

      if ( like ) {

        state.lists = Object.assign(
          {},
          state.lists,
          {
            [ 'profile' ]: {
              products: [ Object.assign( {}, product ) ],
              scrollTop: 0,
              scrollHeight: 0,
              lengthList: ITEMS_PER_PAGE,
              isInfinity: true,
              animateShow: true,
              hasMore: true
            }
          }
        )

      }

    }

  },

  [PRODUCTS_SET_COLUMN_NUMBER] ( state, columnNumber = 3 ) {

    state.columnCount = columnNumber;

  },

  [PRODUCTS_INC_LENGTH_LIST] ( state, count = ITEMS_PER_PAGE ) {

    if ( state.lists.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].lengthList += count;
      state.loading = false;

    }

  },

  [PRODUCTS_LOADING] ( state, loading = true ) {

    state.loading = loading;

  },

  [PRODUCTS_CLOSE] ( state ) {

    if ( state.lists.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].lengthList = ITEMS_PER_PAGE;

    }

    state.loading = true;

  },

  [PRODUCTS_SET_SCROLL] ( state, scrollTop = 0, scrollHeight = 0 ) {

    if ( state.lists.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].scrollTop    = scrollTop;
      state.lists[ state.listId ].scrollHeight = scrollHeight;

    }

  },

  [PRODUCTS_SET_INFINITY] ( state, isInfinity = true ) {

    if ( state.lists.hasOwnProperty( state.listId ) ) {

      state.lists[ state.listId ].isInfinity = isInfinity;

    }

  },

  [PRODUCTS_SET_ANIMATE] ( state, animateShow = true, listId = state.listId ) {

    if ( state.lists.hasOwnProperty( listId ) ) {

      state.lists[ listId ].animateShow = animateShow;

    }

  }

};

export default {
  state,
  mutations
};
