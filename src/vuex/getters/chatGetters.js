import * as leads from 'services/leads';

export const getConversationId = ({conversation}) => conversation.id;
export const getMessages = ({conversation}) => conversation.messages;
export const getLead = ({conversation}) => conversation.lead;
export const getStatus = ({conversation:{lead}}) => {
	if ( lead ) {
		return lead.status;
	}
	return null;
};
export const getStatusName = ({conversation:{lead}}) =>{
	if ( lead ) {
		return leads.getStatus(lead.status).name;
	}
	return null;
};
export const getConversationName = ({conversation:{lead}}) => {
	if ( lead ) {
		return lead.shop.instagram_username;
	}
	return null;
};
export const getConversationPhoto = ({conversation:{lead}}) => {
	if ( lead ) {
		return lead.shop.instagram_avatar_url;
	}
	return null;
};
export const getShopName = ({conversation:{lead}}) => {
	if ( lead ) {
		return  lead.shop.instagram_username;
	}
	return null;
};
export const getShowMenu = ({conversation}) => conversation.showMenu;
export const getShowStatusMenu = ({conversation}) => conversation.showStatusMenu;
export const getLastMessageId = ({conversation, user}) => {
	const {user_id} = getCurrentMember({conversation, user});
	return conversation.members
	     .filter(member => member.user_id !== user_id)
	     .map(member => member.last_message_id)
	     .sort((a, b) => b - a)[0];
};
export const getCurrentMember = ({conversation, user}) => {
	if(conversation.members === undefined || conversation.members === null){
		return null;
	}
	return conversation.members.find(({user_id}) => {
		return user_id === user.id;
	});
};

export const conversationNotifyCount = state => state.notify_count;
