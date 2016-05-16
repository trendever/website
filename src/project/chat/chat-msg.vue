<style src="./styles/chat-msg.pcss"></style>
<template lang="jade">

.chat-row(:class="getSide")
  span(class="bubble_info_time") {{ datetime }}
  .chat-msg.bubble
    .chat-msg_t(v-if="!isOwnMessage")
      | {{{ getUsername }}}
    .chat-msg_txt
      | {{ msg.parts[0].content }}
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