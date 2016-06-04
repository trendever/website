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

export const hasMore = ( state ) => (getList( state ) !== null) ? getList( state ).hasMore : true;

export const isInfinity = ( state ) => (getList( state ) !== null) ? getList( state ).isInfinity : null;

export const getColumnCount = ( { products } ) => products.columnCount;

export const isLoading = ( { products } ) => products.loading;

export const isAnimateShow = ( { products } ) => products.animateShow;

export const getLastProduct = ( state ) => {

  const products = getProducts( state );

  if ( products !== null ) {

    return products[ products.length - 1 ];

  }

  return null;

};

export const getProduct = ( state ) => {

  const products = getProducts( state );

  if ( Array.isArray( products ) ) {

    return products.filter( ( { id } ) => id === state.products.productId )[ 0 ];

  }

  return null;

};

export const getOpenedProduct = ( { products } ) => products.openedProduct;
