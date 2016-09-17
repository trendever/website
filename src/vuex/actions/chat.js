import {
  CONVERSATION_SET,
  CONVERSATION_SET_ACTION,
  CONVERSATION_RECEIVE_MESSAGE,
  CONVERSATION_LOAD_MESSAGE,
  CONVERSATION_SET_SHOW_MENU,
  CONVERSATION_SET_SHOW_STATUS_MENU,
  CONVERSATION_CONFIRM_MSG,
  CONVERSATION_CONFIRM_STATUS_MSG,
  CONVERSATION_CLOSE,
  LEAD_RECEIVE,
  LEAD_UPDATE,
  CONVERSATION_SEND_STATUS,
  CONVERSATION_INC_LENGTH_LIST,
  CONVERSATION_OPEN_IMG_POPUP
} from '../mutation-types'
import * as messageService from 'services/message.js'
import * as leads from 'services/leads.js'
import * as chat from 'services/chat.js'
import {
  getId,
  isJoined,
  getMessageByLead,
  getMessages,
  getLastMessageId,
  getCountForLoading,
  getCurrentMember
} from 'vuex/getters/chat.js'
import { getLeadById, getGroup, getLeadByConversationId } from 'vuex/getters/lead.js'
import { userID } from 'vuex/getters/user.js'

export const setConversation = ( { dispatch, state }, lead_id ) => {

  function chatJoin( lead_id, callBack ) {
    /**
     * Если пользователь не участник чата то его необходимо присоединить к чату.
     * */
    return chat
      .join( { lead_id } )
      .then( () => {
        return leads
          .get( { lead_id } )
          .then( ( { messages, lead, error } ) => {
            return callBack( { messages, lead, error } )
          } )
          .catch( ( error ) => {
            leads.sendError( error )
          } )

      } )
      .catch( ( error ) => {
        chat.sendError( error )
      } )

  }

  function run( messages = [], lead = {} ) {

    /**
     * Запучкает чат.
     * */
    console.log('%cChat Run!','font-size:1.4rem; color: blue');

    if ( lead.chat ) {
      console.log('%cLead:','font-size:1.4rem; color: blue',JSON.parse(JSON.stringify(lead)));
      if ( lead.chat.id ) {

        const { chat:{ id:conversation_id } } = lead

        if ( Array.isArray( messages ) ) {
          console.log('%cMessages:','font-size:1.4rem; color: blue',JSON.parse(JSON.stringify(messages)));
          if ( messages.length > 0 ) {

            const msg = messages[ messages.length - 1 ]

            if ( state.leads.notify_count[ lead_id ] ) {

              const currentRole  = getCurrentMember( state, lead ).role
              const customerRole = chat.MEMBER_ROLES.CUSTOMER

              // TODO Объединить в функцию #logicReading

              if (
                ( customerRole === currentRole ) ||
                ( ( msg.user ) ? ( msg.user.role === customerRole && currentRole !== customerRole ) : true )
              ) {
                messageService
                  .update( conversation_id, msg.id )
                  .catch( ( error ) => {
                    messageService.sendError( error, {
                      conversation_id,
                      messages,
                      lastMessageId: msg.id
                    } )
                  } )
                console.log('%cОбновление Сообщений!','font-size:1.4rem; color: blue');
              }

            }

          }

        }

        dispatch( CONVERSATION_SET, conversation_id, messages, getCountForLoading )

      }

    }

  }

  const lead = getLeadById( state, lead_id )

  if ( lead !== null ) {

    /**
     * Переход состраницы списка чатов.
     * */

    if ( isJoined( state, lead ) ) {

      return new Promise( ( resolve, reject ) => {

        const messages = getMessageByLead( state, lead )

        if ( messages === null ) {

          if ( lead.chat ) {

            if ( lead.chat.id ) {
               console.log('Из чатов');
              return messageService
                .find( lead.chat.id, null, getCountForLoading )
                .then(
                  ( messages ) => {
                    if ( Array.isArray( messages ) ) {
                      run( messages, lead )
                    }
                    resolve()
                  } )
                .catch( ( error ) => {
                  messageService.sendError( error, state )
                  reject( error, state )
                } )

            }

          }

        } else {

          run( messages, lead )

          resolve()

        }

      } )

    } else {

      return chatJoin( lead.id, ( { lead } ) => {

        if ( lead.chat ) {

          dispatch( LEAD_UPDATE, {
            conversation_id: lead.chat.id,
            members: lead.chat.members,
            updated_at: lead.chat.recent_message.created_at * 1e9
          } )

          return setConversation( { dispatch, state }, lead_id )

        }

      } )

    }

  } else {

    /**
     * Лиды инициализирутся отдельно, setConversation будет вызвана как только лиды инициализируются.
     * Прямой переход на страницу чата.
     * */

    return leads
      .get( { lead_id } )
      .then(
        ( { messages = [], lead, error } ) => {

          if ( error !== null ) {

            if ( error.code === 2 ) { // User in't a member it is mean that user need to join.

              return chatJoin( lead_id, ( { lead } ) => {

                dispatch( LEAD_RECEIVE, [ lead ], getGroup( state, lead ) )

                return setConversation( { dispatch, state }, lead_id )

              } )

            }

          } else {
            console.log('Запускается здесь');
            dispatch( LEAD_RECEIVE, [ lead ], getGroup( state, lead ) )
            return messageService
                .find( lead.chat.id, null, getCountForLoading )
                .then(
                  ( messages ) => {
                    if ( Array.isArray( messages ) ) {
                      run( messages, lead )
                    }
                    resolve()
                  } )
                .catch( ( error ) => {
                  messageService.sendError( error, state )
                  reject( error, state )
                } )

          }

        } )
      .catch( ( error ) => {

        leads.sendError( error, state )
        return error

      } )

  }

}

export const loadMessage = (() => {

  const hasMore = {};

  return ( { dispatch, state } ) => {

    if ( !hasMore.hasOwnProperty( state.conversation.id ) ) {

      hasMore[ state.conversation.id ] = true

    }

    return new Promise( ( resolve, reject ) => {

      const messages = getMessages( state )
      const id       = state.conversation.id

      if ( Array.isArray( messages ) ) {

        if ( hasMore[ state.conversation.id ] ) {

          return messageService
            .find( id, messages.length > 0 ? messages[ 0 ].id : undefined, getCountForLoading )
            .then(
              ( messages ) => {

                if ( messages === null || messages.length < getCountForLoading ) {

                  hasMore[ state.conversation.id ] = false;

                }

                if ( Array.isArray( messages ) ) {

                  dispatch( CONVERSATION_LOAD_MESSAGE, messages )
                  dispatch( CONVERSATION_INC_LENGTH_LIST, messages.length )
                  resolve( messages )

                }

              },
              ( error ) => {

                messageService.sendError( error, state )
                reject()

              }
            )

        }

        if ( !hasMore[ state.conversation.id ] && messages.length >= state.conversation.lengthList ) {

          dispatch( CONVERSATION_INC_LENGTH_LIST, getCountForLoading )

          resolve( messages );

          return null;

        }

        resolve( null )

      } else {

        reject()

        console.error( '[ loadMessage ]: messages must be array' )

      }

    } )

  }

})();

export const createMessage = ( { dispatch, state }, conversation_id, text, mime_type ) => {

  const beforeLoadId = Math.random()

  const rowMessage = [
    {
      beforeLoadId,
      loaded: false,
      conversation_id: conversation_id,
      user_id: userID( state ),
      parts: [
        {
          content: text,
          mime_type: mime_type
        }
      ],
      created_at: null,
      id: Date.now() + beforeLoadId,
      user: {
        user_id: userID( state )
      }
    }
  ]

  dispatch( CONVERSATION_RECEIVE_MESSAGE, rowMessage, conversation_id )

  return messageService
    .create( conversation_id, text, mime_type )
    .then( ( { chat, messages, error } ) => {

      dispatch( CONVERSATION_CONFIRM_MSG, beforeLoadId, messages[ 0 ], conversation_id )

    } )
    .catch( ( error ) => {

      messageService.sendError( error, state )

    } )

}

export const receiveMessage = ( { dispatch, state }, conversation_id, messages ) => {

  if ( Array.isArray( messages ) ) {

    if ( messages.length > 0 ) {

      const msg = messages[ messages.length - 1 ]

      const msgUserId = msg.user ? msg.user.user_id : null

      dispatch( CONVERSATION_RECEIVE_MESSAGE, messages, conversation_id )

      if ( userID( state ) !== msgUserId ) {

        if ( state.conversation.id === msg.conversation_id ) {

          if ( getLastMessageId( state ) !== msg.id ) {

            const currentRole  = getCurrentMember( state ).role
            const customerRole = chat.MEMBER_ROLES.CUSTOMER

            // TODO Объединить в функцию #logicReading

            if (
              ( customerRole === currentRole ) ||
              ( ( msg.user ) ? ( msg.user.role === customerRole && currentRole !== customerRole ) : true )
            ) {

              messageService
                .update( conversation_id, msg.id )
                .catch( ( error ) => {
                  messageService.sendError( error, {
                    conversation_id,
                    messages,
                    lastMessageId: msg.id
                  } )
                } )

              return null

            }

          }

        }

      }

      if ( msg.parts[ 0 ].mime_type === 'json/status' ) {

        dispatch( CONVERSATION_CONFIRM_STATUS_MSG, messages, conversation_id )

      }

    }

  }

}

export const addPreLoadMessage = ( { dispatch, state }, base64, base64WithPrefix, MIME, { width, height } ) => {

  const beforeLoadId = Math.random()

  const preLoadMessage = {
    id: Date.now() + beforeLoadId,
    beforeLoadId,
    loaded: false,
    conversation_id: getId( state ),
    created_at: null,
    user_id: userID( state ),
    user: {
      user_id: userID( state )
    },
    parts: [
      {
        content: {
          link: base64WithPrefix,
          width,
          height
        },
        mime_type: 'image/base64'
      }
    ]
  }

  dispatch( CONVERSATION_RECEIVE_MESSAGE, [ preLoadMessage ], getId( state ) )

  messageService.create( getId( state ), base64, MIME ).then( ( { messages } ) => {

    dispatch( CONVERSATION_CONFIRM_MSG, beforeLoadId, messages[ 0 ], getId( state ) )

  }, messageService.sendError )

}

export const setStatus = ( { dispatch, state }, status, type ) => {

  const statusMap = {
    COMPLETE: 'COMPLETED',
    DELIVERY: 'ON_DELIVERY',
    SUBMIT: 'SUBMITTED',
    CANCEL: 'CANCELLED'
  }

  const messages = getMessages( state )

  const { parts } = messages[ messages.length - 1 ]

  dispatch( CONVERSATION_SEND_STATUS )

  /**
   * Добавлять одинаковый статус нет необходимости.
   * */

  if ( parts[ 0 ].mime_type === "json/status" ) {

    if ( JSON.parse( parts[ 0 ].content ).value === statusMap[ status ] ) {

      return null

    }

  }

  const dirtyStatusMessage = [
    {
      dirty: true,
      id: Date.now() + Math.random(),
      conversation_id: state.conversation.id,
      parts: [ {
        content: JSON.stringify( {
          type: type,
          value: statusMap[ status ]
        } ),
        mime_type: "json/status"
      } ],
      created_at: null
    }
  ]

  const lead = getLeadByConversationId( state, state.conversation.id )

  if ( lead !== null ) {

    dispatch( CONVERSATION_RECEIVE_MESSAGE, dirtyStatusMessage, state.conversation.id )

    return new Promise( ( resolve, reject ) => {
      leads
        .setEvent( lead.id, status )
        .then( ( { status } ) => {
          resolve( status )
        } )
        .catch( error => {
          reject( error )
        } )
    } )

  } else {

    console.error( '[ ACTION/CHAT ] - В момент установки статуса lead не может быть null.', {
      conversation_id: state.conversation.id
    } )

  }

}

export const onMessages = ( { dispatch, state }, data ) => {

  if ( data.response_map ) {

    if ( data.response_map.chat && data.response_map.messages ) {

      const conversation_id = data.response_map.chat.id
      const messages        = data.response_map.messages

      return receiveMessage( { dispatch, state }, conversation_id, messages )

    }

  }

  return null

}

export const setShowMenu = ( { dispatch }, showMenu ) => {

  dispatch( CONVERSATION_SET_SHOW_MENU, showMenu )

}

export const setShowStatusMenu = ( { dispatch }, showStatusMenu ) => {

  dispatch( CONVERSATION_SET_SHOW_STATUS_MENU, showStatusMenu )

}

export const closeConversation = ( { dispatch } ) => {
  dispatch(CONVERSATION_SET_ACTION, '');
  dispatch( CONVERSATION_CLOSE )

}

export const openPopUp = ( { dispatch }, url = false, width = 0, height = 0 ) => {

  dispatch( CONVERSATION_OPEN_IMG_POPUP, url, width, height )

}

export const setConversationAction = (({dispatch}, value)=>{

  dispatch( CONVERSATION_SET_ACTION, value);

})
