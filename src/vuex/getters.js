// User
export const isAuth = state => state.user.isAuth;
export const userID = state => state.user.id;
export const userName = state => {
  if (state.user.name) {
    return state.user.name;
  }
  return state.user.instagram_username;
};

// Products
export const products = state => state.products.all;
export const openedProduct = state => state.products.opened;
export const isWaitReponseProducts = state => state.products.isWaitResponse;
export const isInfinityProducts = state => state.products.isInfinity;

// Leads
export const leads = state => state.leads.all;
export const leadsTab = state => state.leads.tab;
export const currentLead = state => {
  return state.leads.all.find(
    obj => obj.conversation_id === state.chat.opened_id
  );
};

// Chat
export const chatNotifyCount = state => state.chat.notify_count;
export const currentChat = state => {
  return state.chat.all.find( obj => obj.id === state.chat.opened_id );
};
export const currentChatMember = state => {
  let curChat = currentChat(state);
  if (!curChat) {return;}

  return curChat.members.find( obj =>  obj.user_id === state.user.id );
};

// Search
export const searchValue = state => state.search.value;
export const tags = state => state.search.tags;
export const selectedTags = state => state.search.selectedTags;

// Popups
export const isShowPopupSignup = state => state.popups.showSignup;
export const isShowPopupFastSignup = state => state.popups.showFastSignup;