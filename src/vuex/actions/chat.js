import {
	CONVERSATION_SET,
	CONVERSATION_RECEIVE_MESSAGE,
	CONVERSATION_LOAD_MESSAGE,
	CONVERSATION_CLOSE,
	CONVERSATION_UPDATE_MEMBERS,
	CONVERSATION_SET_SHOW_MENU,
	CONVERSATION_SET_SHOW_STATUS_MENU,
	CONVERSATION_SET_STATUS,
	CONVERSATION_AFTER_LOAD_IMG
} from '../mutation-types';
import * as messageService from 'services/message.js';
import * as leads from 'services/leads.js';
import * as chat from 'services/chat.js';
import messageCache from 'cache/message';
import { getCurrentMember, getId, getLastMessageId } from 'vuex/getters/chat.js';
import { userID } from 'vuex/getters';

export const setConversation = ( { dispatch }, lead_id ) => {

	const promise = leads.get( { lead_id } );

	promise.then( ( { messages, lead, error } ) => {

		if (error !== null) {

			if (error.code === leads.ERROR_CODES.FORBIDDEN) {

				return chat.join( { lead_id } ).then(
					() => {
						return setConversation( { dispatch }, lead_id );
					},
					( error ) => {
						console.log( `Join to chat error: ${(leads.ERROR_CODES.FORBIDDEN === error) ? '[ FOBIDDEN ]' : ''}` );
					}
				);

			}

		}

		if ( messages !== null ) {
      
      const lastMessageId = messages[ messages.length - 1 ].id;
      const {chat:{id:conversation_id, members}} = lead;
      
      messageCache.init( conversation_id, messages );
      
      dispatch( CONVERSATION_SET, conversation_id, members, messages, lead );
      
      return messageService.update(conversation_id, lastMessageId);
      
    } else {
      
      const {chat:{id:conversation_id, members}} = lead;
      
      dispatch( CONVERSATION_SET, conversation_id, members, [], lead );
      
    }
    
	} );

	promise.catch( (error) => {
		console.log( `Set conversation error: ${(leads.ERROR_CODES.FORBIDDEN === error) ? '[ FOBIDDEN ]' : ''}` );
	} );

	return promise;

};

export const loadMessage = ( { dispatch, state:{ conversation:{ id, messages } } } ) => {

	return new Promise( ( resolve, reject ) => {

		if ( messages !== null ) {

			const promise = messageService.find( id, messages[ 0 ].id );

			promise.then( ( messages ) => {

				if ( messages !== null ) {

					dispatch( CONVERSATION_LOAD_MESSAGE, messages );

					resolve( messages );

				}

			} );

			promise.catch( ( error ) => {

				console.warn( error );

				reject( error );

			} );

		} else {

			const error = `[ WARN ]: message can't be null`;

			console.warn( error );

			reject( error );

		}

	} );

};

export const createMessage = ( store, conversation_id, text, mime_type ) => {
	return messageService.create( conversation_id, text, mime_type );
};

export const receiveMessage = ( { dispatch, state }, chat, messages ) => {

	return new Promise( ( resolve, reject ) => {

		let count = messages.length;

		if(count > 0) {

			const msg = messages[count - 1];
			const isNotLastMessage = getLastMessageId(state) !== msg.id;

			if(isNotLastMessage) {

				messageService.update(msg.conversation_id, msg.id).then(() => {

					messageCache.addReceiveMessage( msg.conversation_id, messages );

					// ToDo not optimal code. Dmitry refactor this.
					if (msg.conversation_id === state.conversation.id) {

						dispatch( CONVERSATION_RECEIVE_MESSAGE, messages );

					} else {
						reject('Receive msg from to other chat.');
					}

					resolve();

				}, reject);

			} else {

				resolve();

			}

		}

	} );

};

export const updateMembers = ( { dispatch, state }, user_id, chat ) => {

	let isCurrentChat    = chat.id === getId( state );
	let isNotCurrentUser = user_id !== getCurrentMember( state ).user_id;

	if ( isCurrentChat && isNotCurrentUser ) {

		dispatch( CONVERSATION_UPDATE_MEMBERS, chat.members );

	}

};

export const applyStatus = ({ dispatch }, status) => {
	dispatch(CONVERSATION_SET_STATUS, status);
};

export const setStatus = ( { dispatch, state:{conversation:{lead:{id}}} }, status ) => {
	return new Promise((resolve, reject) => {
		leads.setEvent(id, status).then( ({status}) => {
			dispatch(CONVERSATION_SET_STATUS, status);
			resolve(status);
		}).catch( error => {
			reject(error);
		});
	});
};

export const setShowMenu = ( { dispatch }, showMenu ) => {
	dispatch(CONVERSATION_SET_SHOW_MENU, showMenu);
};

export const setShowStatusMenu = ( { dispatch }, showStatusMenu ) => {
	dispatch(CONVERSATION_SET_SHOW_STATUS_MENU, showStatusMenu);
};

export const closeConversation = ({ dispatch }) => {
	dispatch(CONVERSATION_CLOSE);
};

export const addPreLoadMessage = ( { dispatch, state }, base64, base64WithPrefix, MIME ) => {

	const beforeLoadId = Math.random();

	const preLoadMessage = {
		beforeLoadId,
		loaded: false,
		conversation_id: getId( state ),
		created_at: Date.now(),
		user_id: userID( state ),
		user: {
			user_id: userID( state ),
		},
		parts: [
			{
				content: {
					link: base64WithPrefix,
				},
				mime_type: 'image/base64',
			}
		]
	};

	dispatch( CONVERSATION_RECEIVE_MESSAGE, [ preLoadMessage ] );

	messageService.create( getId( state ), base64, MIME ).then( ( {messages} ) => {

		dispatch( CONVERSATION_AFTER_LOAD_IMG, beforeLoadId, messages[0] );

	}, ( error ) => {

		console.log( error );

	} );

};
