import * as types from '../mutation-types';
import * as messages from 'services/message.js';
import * as leads from 'services/leads.js';

/**
 * Set conversation
 * @param  {number} id  lead_id
 */
export const setConversation = ( { dispatch }, id ) => {
	const promise = leads.get(
		{
			lead_id: id
		}
	);
	promise.then( ( { messages, lead: {id, chat: { members } } } ) => {
		dispatch( types.SET_CONVERSATION, id, members, messages );
	} );
	promise.catch( (error) => {
		console.log("Set conversation error:", error);
	} );
};

export const messageLoad = ({ dispatch }) => {
	dispatch( types.LOAD_MESSAGE, [] );
};

/**
 * Create message in chat
 * @param  {number} conversation_id  chat_id
 * @param  {string} text             text of message
 * @param  {string} mime_type        type of message (text/plain, text/json)
 */
export const createChatMsg = ( { dispatch, state }, conversation_id, text, mime_type ) => {
	return new Promise( ( resolve, reject ) => {
		const promise = messages.create( conversation_id, text, mime_type );
		promise.then( data => {
			resolve( data.chat.id, data.messages[ 0 ] );
		} );
		promise.catch( error => {
			reject( error );
		} );
	} );
};

export const receiveChatNotify = ({ dispatch, state }, chatId, messages) => {

	// TODO с этим можно разбираться когда будет сделана мемоизация и загрузка сообщений.

	dispatch(types.RECEIVE_CHAT_MSG, chatId, messages[0]);

	if (state.chat.opened_id !== chatId) {
		dispatch(types.INCREMENT_CHAT_NOTIFY_COUNT);
	}

};

export const readedAllChatNotify = ({ dispatch }) => {
	// TODO с этим можно разбираться когда будет сделана мемоизация и загрузка сообщений.
	dispatch(types.CLEAR_CHAT_NOTIFY_COUNT);
};

export const setMessageRead = ( { dispatch }, { id, members } ) => dispatch( types.UPDATE_CHAT_MEMBERS, id, members );




