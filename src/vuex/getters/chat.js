import * as leads from 'services/leads';
import {formatMonth} from 'project/chat/utils';

export const getId = ({conversation}) => conversation.id;
export const getMessages = ({conversation}) => conversation.messages;
export const getShowMenu = ({conversation}) => conversation.showMenu;
export const getShowStatusMenu = ({conversation}) => conversation.showStatusMenu;
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
export const getPhoto = ({conversation:{lead}}) => {
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

export const getCurrentMember = ({conversation, user}) => {
	if (conversation.members === undefined || conversation.members === null) {
		return null;
	}
	return conversation.members.find(({user_id}) => {
		return user_id === user.id;
	});
};

export const getLastMessageId = ({conversation, user}) => {
	const {user_id} = getCurrentMember({conversation, user});
	return conversation.members
	                   .filter(member => member.user_id !== user_id)
	                   .map(member => member.last_message_id)
	                   .sort((a, b) => b - a)[0];
};
export const conversationNotifyCount = state => state.notify_count;

export const getInviteShop           = ( { conversation:{ lead } } ) => {
	return lead.shop.supplier.has_email || lead.shop.supplier.has_phone;
};
export const getInviteCustomer       = ( { conversation:{ lead } } ) => {
	return lead.customer.has_phone;
};
export const getCreateData = ({ conversation:{ lead } }) => {
	return formatMonth(lead.chat.recent_message.created_at);
};