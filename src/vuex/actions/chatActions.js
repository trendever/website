import * as types from '../mutation-types';
import * as messageService from 'services/message.js';
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
	promise.then( ( { messages, lead } ) => {
		dispatch( types.SET_CONVERSATION, lead.id, lead.chat.members, messages, lead );
	} );
	promise.catch( (error) => {
		console.log("Set conversation error:", error);
	} );
	return promise;
};

export const loadMessage = ( { dispatch, state:{ conversation:{ id, messages } } } ) => {

	const promise = messageService.find( id, messages[ 0 ].id );

	promise.then( ( messages ) => {
		if(messages !== null){
			dispatch( types.RECEIVE_MESSAGE, messages );
		}
	} );

	promise.catch( ( error ) => {
		console.log( error );
	} );

	return promise;

};

/**
 * Create message in chat
 * @param  {number} conversation_id  chat_id
 * @param  {string} text             text of message
 * @param  {string} mime_type        type of message (text/plain, text/json)
 */
export const createMessage = ( { dispatch }, conversation_id, text, mime_type ) => {
	const promise = messageService.create( conversation_id, text, mime_type );
	promise.then( data => {
		dispatch(types.CREATE_MESSAGE, data.messages);
	} );
	promise.catch( error => {
		console.log(error);
	} );
	return promise;
};

export const receiveMessage = ({ dispatch }, message) => {
	dispatch(types.RECEIVE_CHAT_MSG, message);
};

export const receiveChatNotify = ({ dispatch, state }, conversation_id, messages) => {

	dispatch(types.RECEIVE_CHAT_MSG, messages[0]);

	if (state.conversation.id !== conversation_id) {
		dispatch(types.INCREMENT_CHAT_NOTIFY_COUNT);
	}

};

export const readedAllChatNotify = ({ dispatch }) => {
	dispatch(types.CLEAR_CHAT_NOTIFY_COUNT);
};

export const setMessageRead = ( { dispatch },  id, members  ) => {
	
	dispatch( types.UPDATE_CHAT_MEMBERS, id, members );
	
};



