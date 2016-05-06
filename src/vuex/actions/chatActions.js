import * as types from '../mutation-types';
import * as messageService from 'services/message.js';
import * as leads from 'services/leads.js';
import { getCurrentMember, getId, getLastMessageId } from 'vuex/getters/chatGetters.js';

export const setConversation = ( { dispatch }, id ) => {

	const promise = leads.get(
		{
			lead_id: id
		}
	);

	promise.then( ( { messages, lead } ) => {
		dispatch(
			types.SET_CONVERSATION,
			lead.id,
			lead.chat.members,
			messages,
			lead,
			messages[ messages.length - 1 ].id
		);
	} );

	promise.catch( (error) => {
		console.log("Set conversation error:", error);
	} );

	return promise;
};

export const loadMessage = ( { dispatch, state:{ conversation:{ id, messages } } } ) => {

	const promise = messageService.find( id, messages[ 0 ].id );

	promise.then( ( messages ) => {
		if ( messages !== null ) {
			dispatch( types.LOAD_MESSAGE, messages );
		}
	} );

	promise.catch( ( error ) => {
		console.log( error );
	} );

	return promise;

};

export const createMessage = ( { dispatch }, conversation_id, text, mime_type ) => {
	return messageService.create( conversation_id, text, mime_type );
	/*	const promise = messageService.create( conversation_id, text, mime_type );
	promise.then( data => {
		dispatch(types.CREATE_MESSAGE, data.messages);
	} );
	promise.catch( error => {
		console.log(error);
	} );
	 return promise;*/
};

export const receiveMessage = ( { dispatch, state }, chat, messages ) => {

	return new Promise( ( resolve, reject ) => {

		let count = state.conversation.messages.length;

		if(count > 0) {

			const msg = state.conversation.messages[count - 1];
			const isNotLastMessage = getLastMessageId(state) !== msg.id;

			if(isNotLastMessage) {
				messageService.update(msg.conversation_id, msg.id).then(() => {
					dispatch( types.RECEIVE_MESSAGE, messages );
					resolve();
				}, reject);
			}

		}

	} );

};

export const updateMembers = ( { dispatch, state }, user_id, chat ) => {

	let isCurrentChat    = chat.id === getId( state );
	let isNotCurrentUser = user_id !== getCurrentMember( state ).user_id;
	if ( isCurrentChat && isNotCurrentUser ) {
		dispatch( types.UPDATE_CHAT_MEMBERS, chat.members );
	}

};

export const setStatus = ( { dispatch, state:{conversation:{lead:{id}}} }, status ) => {

	return new Promise((resolve, reject) => {

		leads.setEvent(id, status).then( (lead) => {

			dispatch(types.CHANGED_LEAD_STATUS, lead.status);
			resolve(lead.status);

		}).catch( error => {

			reject(error);

		});

	});
	
};

export const setShowMenu = ( { dispatch }, showMenu ) => {
	dispatch(types.SET_SHOW_MENU, showMenu);
};

export const setShowStatusMenu = ( { dispatch }, showStatusMenu ) => {
	dispatch(types.SET_SHOW_STATUS_MENU, showStatusMenu);
};

export const receiveChatNotify = ( { dispatch, state }, conversation_id, messages ) => {
	dispatch( types.RECEIVE_MESSAGE, messages );
	if (state.conversation.id !== conversation_id) {
		dispatch(types.INCREMENT_CHAT_NOTIFY_COUNT);
	}
};

export const readedAllChatNotify = ({ dispatch }) => {
	dispatch(types.CLEAR_CHAT_NOTIFY_COUNT);
};





