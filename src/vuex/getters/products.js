export const lists = state => state.products.lists;
export const openedProduct = state => state.products.openedProduct;
export const openedListName = state => state.products.openedList;

export const isWaitReponseProducts = state => {
  let list = state.products.lists[state.products.openedList]
  return list ? list.isWaitResponse : false
}
export const hasMoreProducts = state => {
  let list = state.products.lists[state.products.openedList]
  return list ? list.hasMore : true
}
export const isInfinityProducts = state => {
  let list = state.products.lists[state.products.openedList]
  return list ? list.isInfinity : true
}
export const getColumnNumber = state => {
  let list = state.products.lists[state.products.openedList]
  return list ? list.columnNumber : 0
}
