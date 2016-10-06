import * as leads from 'services/leads';
import * as chat from 'services/chat';
import { formatMonth } from 'project/chat/utils';
import { userID } from 'vuex/getters/user.js';
import { getLeadByConversationId } from '../getters/lead.js';

export const getId = ( { conversation } ) => conversation.id;

export const getLengthList = ( { conversation } ) => conversation.lengthList;

export const getLeadId = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    return lead.id;

  }

  return null;

};

export const getCustomerName = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    if ( lead.chat ) {

      if ( lead.chat.members ) {

        const user = lead.chat.members.find( ( user ) => {

          return user.role === chat.MEMBER_ROLES.CUSTOMER;

        } );

        if ( typeof user !== 'undefined' ) {

          /**
           * Это имя запоминается на момент создания чата.
           * */

          return user.name;

        }

      }

    }

  }

  return null;

};

export const getCustomerId = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead ) {

    if ( lead.chat ) {

      if ( lead.chat.members ) {

        const user = lead.chat.members.find( ( user ) => {

          return user.role === chat.MEMBER_ROLES.CUSTOMER;

        } );

        if ( typeof user !== 'undefined' ) {

          /**
           * Это имя запоминается на момент создания чата.
           * */

          return user.user_id;

        }

      }

    }

  }

  return null;

};

export const getMessageByLead = ( { conversation }, lead ) => {

  if ( lead.chat ) {

    if ( lead.chat.id ) {

      if ( conversation.all.hasOwnProperty( lead.chat.id ) ) {

        if ( Array.isArray( conversation.all[ lead.chat.id ] ) ) {

          return conversation.all[ lead.chat.id ];

        }

      }

    }

  }

  return null;

};

export const getMessages = ( { conversation:{ id, all } } ) => {

  const messages = all[ id ];

  if ( Array.isArray( messages ) ) {

    return messages;

  }

  return [];

};

export const getShowMenu = ( { conversation } ) => conversation.showMenu;

export const getShowStatusMenu = ( { conversation } ) => conversation.showStatusMenu;

export const getShowCancelMenu = ( { conversation } ) => conversation.showCancelMenu;

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

    return lead.shop.avatar_url || lead.shop.instagram_avatar_url;

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

export const getShopId = ( state ) => {

  const lead = getLeadByConversationId( state, state.conversation.id );

  if ( lead !== null ) {

    return lead.shop.id;

  }

  return null;

};

export const getCurrentMember = ( state, lead = getLeadByConversationId( state, state.conversation.id ) ) => {

  if ( lead ) {

    if ( lead.chat ) {

      if ( lead.chat.members ) {

        if ( Array.isArray( lead.chat.members ) ) {

          const result = lead.chat.members.find( ( { user_id } ) => {

            return user_id === state.user.id;

          } );

          if ( typeof result === 'undefined' ) {

            return null;

          }

          return result;

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

export const getAction = ( state ) => {
  return state.conversation.action.type;
}

export const getActionData = ( state ) => {
  return state.conversation.action.data;
}

export const getCountForLoading = 50;//(window.browser.mobile) ? 10 : 20;

export const imgPopUpUrl = ( state ) => state.conversation.imgPopUpUrl;

export const imgWidth = ( state ) => state.conversation.imgWidth;

export const imgHeight = ( state ) => state.conversation.imgHeight;

export const imgLoader = ( state ) => state.conversation.imgLoader;
