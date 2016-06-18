import { userID } from 'vuex/getters/user.js'

export const getList = ( { products } ) => {

  if ( products.lists.hasOwnProperty( products.listId ) ) {

    return products.lists[ products.listId ];

  }

  return null;

};

export const getProducts = ( state ) => {

  const list = getList( state );

  if ( list !== null ) {

    return list.products;

  }

  return null;

};

export const getProduct = ( state, product_id ) => {

  const products = getProducts( state );

  if ( Array.isArray( products ) ) {

    const result = products.filter( ( { id } ) => id === product_id )[ 0 ];

    if ( typeof result === 'undefined' ) {

      return null;

    }

    return result;

  }

  return null;

};

export const getLastProduct = ( state ) => {

  const products = getProducts( state );

  if ( products !== null ) {

    return products[ products.length - 1 ];

  }

  return null;

};

export const getOpenedProduct = ( { products } ) => products.openedProduct;

export const isLiked = ( state ) => {

  const product = getOpenedProduct( state );

  if ( product !== null ) {

    if ( product.hasOwnProperty( 'liked_by' ) ) {

      for ( let i = product.liked_by.length; i; i-- ) {

        if ( userID( state ) === product.liked_by[ i - 1 ].id ) {

          return true;

        }

      }

      return false;

    }

    return false;

  }

  return false;

};

export const hasMore = ( state ) => (getList( state ) !== null) ? getList( state ).hasMore : true;

export const isInfinity = ( state ) => (getList( state ) !== null) ? getList( state ).isInfinity : null;

export const getColumnCount = ( { products } ) => products.columnCount;

export const isLoading = ( { products } ) => products.loading;

export const isAnimateShow = ( state ) => {

  const list = getList( state );

  if ( list !== null ) {

    return list.animateShow;

  }

  return true;

};

export const getScroll = ( state ) => {

  const list = getList( state );

  if ( list !== null ) {
    return {
      scrollTop: list.scrollTop,
      scrollHeight: list.scrollHeight
    }
  }

  return {};

};

export const getLengthList = ( state ) => (getList( state ) !== null) ?
  getList( state ).lengthList :
  state.products.ITEMS_PER_PAGE;





