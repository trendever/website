<style src="./styles/chat-msg.pcss"></style>
<template lang="jade">

.chat-row(:class="getSide")
  .chat-msg.bubble
    .chat-msg_t
      | {{{ getUsername }}}
    .chat-msg_txt
      | {{ msg.parts[0].content }}
    .bubble_info
      .bubble_info_time {{ datetime }}
      .bubble_info_status(v-if="isOwnMessage")
        i(:class="{'ic-check': isSent, 'ic-check-double': isRead}")

</template>

<script type="text/babel">
  import {
    currentChatMember,
    currentChat,
    currentLead,
  } from 'vuex/getters';

  import * as service from 'services/chat';
  import * as leads from 'services/leads';
  import { formatDatetime } from './utils';

  export default{
    props: {
      msg: {
        type: Object,
        required: true
      },
      lastReadMessageId: Number
    },

    vuex: {
      getters: {
        currentLead,
        currentMember: currentChatMember,
      }
    },

    computed: {
      datetime () {
        return formatDatetime(this.msg.created_at);
      },

      getUsername () {
        if (this.msg.user.role === leads.USER_ROLES.CUSTOMER.key) {
          return `<b>${this.msg.user.name}</b>`
        }
        if (this.msg.user.role === leads.USER_ROLES.SUPPLIER.key) {
          return `<b>${this.currentLead.shop.instagram_username}</b>`
        }

        return `<b>${this.currentLead.shop.instagram_username}</b> (продавец ${this.msg.user.name})`
      },

      isOwnMessage() {
        return this.currentMember.user_id === this.msg.user.user_id
      },

      isSent() {
        return !this.isRead
      },

      isRead() {
        return this.lastReadMessageId >= this.msg.id
      },

      getSide(){
        return this.isOwnMessage ? '__right' : '__left';
      },
    },

  }
</script>