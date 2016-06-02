import * as leads from 'services/leads';
import { formatMonth } from 'project/chat/utils';
import { userID } from 'vuex/getters/user.js';
import { getLeadByConversationId } from '../getters/lead.js';

export const getId = ( { conversation } ) => conversation.id;

export const getLengthList = ({ conversation }) => conversation.lengthList;

export const getLeadId = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    return lead.id;

  }

  return null;

};

export const isInit = ( { conversation }, lead ) => {
  
  if ( lead.chat ) {
    
    if ( lead.chat.id ) {
      
      if ( conversation.allInit.hasOwnProperty( lead.chat.id ) ) {
        
        return conversation.allInit[ lead.chat.id ];
        
      }
      
    }
    
  }
  
  return false;
  
};

export const isMessages = ( { conversation }, lead ) => {

  if ( lead.chat ) {

    if ( lead.chat.id ) {

      if ( conversation.all.hasOwnProperty( lead.chat.id ) ) {
  
        if ( Array.isArray( conversation.all[ lead.chat.id ] ) ) {
    
          return {
            count: conversation.all[ lead.chat.id ].length,
            messages: conversation.all[ lead.chat.id ]
          };
    
        }

      }

    }

  }
  
  return {
    count: 0,
    messages: null
  };

};

export const getMessages = ( { conversation:{ id, all } } ) => {

  const messages = all[ id ];

  if ( Array.isArray( messages ) ) {

    let lastUserId = null;

    return messages.map( ( message ) => {

      if ( message.parts[ 0 ].mime_type === 'text/plain' ) {

        if ( lastUserId === message.user.id ) {

          message.closestMessage = true;

        } else {

          lastUserId             = message.user.id;
          message.closestMessage = false;

        }

      }

      return message;

    } );

  }

  return [];

};

export const getShowMenu = ( { conversation } ) => conversation.showMenu;

export const getShowStatusMenu = ( { conversation } ) => conversation.showStatusMenu;

export const getStatus = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead !== null ) {

    return lead.status;

  }

  return lead;

};

export const getStatusName = ( state ) => {

  const status = getStatus( state );

  if ( status !== null ) {

    return leads.getStatus( status ).name;

  }

  return status;
};

export const getPhoto = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead !== null ) {

    return lead.shop.instagram_avatar_url;

  }

  return null;
};

export const getShopName = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead !== null ) {

    return lead.shop.instagram_username;

  }

  return null;

};

export const getCurrentMember = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    if ( lead.chat ) {

      if ( lead.chat.members ) {

        if ( Array.isArray( lead.chat.members ) ) {

          return lead.chat.members.find( ( { user_id } ) => {

            return user_id === state.user.id;

          } );

        }

      }

    }

  }

  return null;

};

export const getLastMessageId = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  const { user_id } = getCurrentMember( state );

  if ( lead.chat ) {

    if ( lead.chat.members ) {

      return lead
        .chat
        .members
        .filter( member => member.user_id !== user_id )
        .map( member => member.last_message_id )
        .sort( ( a, b ) => b - a )[ 0 ];

    }

  }

};

export const conversationNotifyCount = state => state.leads.global_notify_count;

export const getInviteShop = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    if ( lead.shop ) {

      if ( lead.shop.supplier ) {

        return lead.shop.supplier.has_email || lead.shop.supplier.has_phone;

      }

    }

  }

  console.warn( 'Нет лида или  магазина или поставщика', lead );

  return false;

};

export const getInviteCustomer = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    if ( lead.customer ) {

      return lead.customer.has_phone;

    }

  }

  return false;

};

export const getCreateData = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    if ( lead.chat ) {

      if ( lead.chat.recent_message ) {

        return formatMonth( lead.chat.recent_message.created_at );

      }

    }

  }

  return null;

};

export const isJoined = ( state, lead ) => {

  if ( lead ) {

    if ( lead.chat ) {

      const { members } = lead.chat;
      const currentUserId = userID( state );

      for ( let i = members.length; i; i-- ) {

        const { user_id } = members[ i - 1 ];

        if ( user_id === currentUserId ) {

          return true;

        }

      }

    }

  }

  return false;

};

export const getRowHeight = () => {
  
  if ( window.matchMedia( '(max-width: 750px)' ).matches ) {
    return 65
  }
  
  return 50;
  
};

export const getCountRowOnBody = () => Math.round( document.body.offsetHeight / getRowHeight() );
