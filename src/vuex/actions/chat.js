import {
  CONVERSATION_SET,
  CONVERSATION_RECEIVE_MESSAGE,
  CONVERSATION_LOAD_MESSAGE,
  CONVERSATION_UPDATE_MEMBERS,
  CONVERSATION_SET_SHOW_MENU,
  CONVERSATION_SET_SHOW_STATUS_MENU,
  CONVERSATION_SET_STATUS,
  CONVERSATION_AFTER_LOAD_IMG,
  LEAD_UPDATE_LEAD_ITEM
} from '../mutation-types';
import * as messageService from 'services/message.js';
import * as leads from 'services/leads.js';
import * as chat from 'services/chat.js';
import { getCurrentMember, getId, getLastMessageId, isJoined } from 'vuex/getters/chat.js';
import { getLeadById } from 'vuex/getters/lead.js';
import { userID } from 'vuex/getters';

export const setConversation = ( { dispatch, state }, lead_id ) => {

  function chatJoin( lead_id, callBack ) {

    return chat.join( { lead_id } ).then( () => {

        return leads.get( { lead_id } ).then( ( { messages, lead, error } ) => {

          if ( leads.sendError( error, state ) ) {

            return callBack( { messages, lead } );

					}

        } );

      },
      ( error ) => {
        console.error( `[ chat.join ]: ${error}` );
			}
    );

  }

  const lead = getLeadById( state, lead_id );

  if ( false ) {

    if ( isJoined( state, lead ) ) {

      console.log( lead );

      debugger;

    } else {

      return chatJoin( lead_id, ( { member, chat } ) => {

        dispatch( LEAD_UPDATE_LEAD_ITEM, lead );
        return setConversation( { dispatch }, lead_id );

      } );

		}

  } else {

    const promise = leads.get( { lead_id } );

    promise.then( ( { messages, lead, error } ) => {

      if ( leads.sendError( error ) ) {

        if ( !isJoined( state, lead ) ) {

          return chatJoin( lead_id, () => {

            dispatch( LEAD_UPDATE_LEAD_ITEM, lead );

            return setConversation( { dispatch }, lead_id );

          } );

        }

      }

      if ( messages === null ) {
        console.error( new Error( 'При получении лида/диалога messages не должнобыть null.' ) );
      }

      const lastMessageId = messages[ messages.length - 1 ].id;
      const { chat:{ id:conversation_id, members } } = lead;

      messageService.update( conversation_id, lastMessageId );
      dispatch( CONVERSATION_SET, conversation_id, members, messages, lead );

    } );

    promise.catch( leads.sendError );

    return promise;

  }

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

        messageService.update( msg.conversation_id, msg.id ).then( () => {

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

export const addPreLoadMessage = ( { dispatch, state }, base64, base64WithPrefix, MIME, { width, height } ) => {

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
          width,
          height
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

export const onStatus = () => {
  
};
export const onMessages = () => {
  
};
export const onMessageRead = () => {
  
};
