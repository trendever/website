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
  // ToDo it is incorrect...
  return curChat.members.find( obj => !obj.role );
};
