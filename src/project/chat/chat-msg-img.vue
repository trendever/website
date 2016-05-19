<style src="./styles/chat-msg-img.pcss"></style>
<template lang="jade">

.chat-row(:class="getSide")
  span(class="bubble_info_time") {{ datetime }}
  .chat-msg.bubble
    .chat-msg_t(v-if="!isOwnMessage")
      | {{{ getUsername }}}
    img(:src="getImg", class="chat-msg-img", v-bind:class="{'chat-msg-img-opacity':!isLoaded }")
    .bubble_info
      .bubble_info_status(v-if="isOwnMessage")
        i(:class="{'ic-check': isSent, 'ic-check-double': isRead}")

</template>

<script type="text/babel">
  import { getCurrentMember, getShopName, getLastMessageId } from 'vuex/getters/chat.js';
  import * as service from 'services/chat';
  import * as leads from 'services/leads';
  import { formatTime } from './utils';

  export default{
    props: {
      msg: {
        type: Object,
        required: true
      }
    },

    vuex: {
      getters: {
        getShopName,
        getCurrentMember,
        getLastMessageId,
      }
    },

    computed: {
      isLoaded(){
        if( 'loaded' in this.msg){
          return this.msg.loaded;
        }
        return true;
      },
      getImg(){
        let cnt = this.msg.parts[ 0 ].content;

        if ( this.msg.parts[ 0 ].mime_type === 'image/json' ) {

          let img = JSON.parse( cnt );
          if (img.thumbs.big) {
            return img.thumbs.big;
          }
          return img.link;
        }

        if ( typeof cnt === 'string' ) {

          return `data:${this.msg.parts[ 0 ].mime_type};base64,${cnt}`;

        }

        if ( cnt.thumbs && cnt.thumbs.big ) {

          return cnt.thumbs.bog

        }

        if ( 'link' in cnt ) {

          return cnt.link;

        }

      },
      datetime() {
        return formatTime(this.msg.created_at);
      },
      getUsername() {
        if (this.msg.user.role === leads.USER_ROLES.CUSTOMER.key) {
          return `<b>${this.msg.user.name}</b>`
        }
        if (this.msg.user.role === leads.USER_ROLES.SUPPLIER.key) {
          return `<b>${this.getShopName}</b>`
        }
        return `<b>${this.getShopName}</b> (продавец ${this.msg.user.name})`
      },
      isOwnMessage() {
        return this.getCurrentMember.user_id === this.msg.user.user_id
      },
      isSent() {
        return !this.isRead
      },
      isRead() {
        return this.getLastMessageId >= this.msg.id
      },
      getSide() {
        return this.isOwnMessage ? '__right' : '__left';
      },
    },

  }
</script>