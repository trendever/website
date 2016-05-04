import * as types from '../mutation-types';
import * as messages from 'services/message.js';

export const receiveChatNotify = ({ dispatch, state }, chatId, messages) => {

	dispatch(types.RECEIVE_CHAT_MSG, chatId, messages[0]);

	if (state.chat.opened_id !== chatId) {
		dispatch(types.INCREMENT_CHAT_NOTIFY_COUNT);
	}
};

export const readedAllChatNotify = ({ dispatch }) => {
	dispatch(types.CLEAR_CHAT_NOTIFY_COUNT);
};

export const setOpenedChat = ({ dispatch }, conversation_id) => {
	dispatch(types.OPEN_CHAT, conversation_id);
};

/**
 * Create message in chat
 * @param  {number} conversation_id  chat_id
 * @param  {string} text             text of message
 * @param  {string} mime_type        type of message (text/plain, text/json)
 */
export const createChatMsg = ({ dispatch, state }, conversation_id, text, mime_type) => {
	return new Promise((resolve, reject) => {

		messages.create(conversation_id, text, mime_type).then( data => {
			resolve(data.chat.id, data.messages[0]);
		}).catch( error => {
			reject(error);
		});

	});
};

export const setMessageRead = ({dispatch}, {id, members}) => dispatch(types.UPDATE_CHAT_MEMBERS, id, members);

