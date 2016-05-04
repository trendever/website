export const getConversationId = state => state.id;
export const getMembers = state => state.members;
export const getMessages = state => state.messages;
export const getCurrentMember = state => state.members[state.current_member_id];

export const chatNotifyCount = state => state.chat.notify_count;

export const currentChat = state => {
	return state.chat.all.find( obj => obj.id === state.chat.opened_id );
};

export const currentChatMember = state => {
	let curChat = currentChat(state);
	if (!curChat) {return;}
	return curChat.members.find( obj =>  obj.user_id === state.user.id );
};