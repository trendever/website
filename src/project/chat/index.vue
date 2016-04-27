<style src="./styles/chat.pcss"></style>
<template lang="jade">
div
  .chat-cnt
    chat-header(:notify-count='chatNotifyCount')
    .section.top.bottom
      .chat.section__content
        .chat_messages
          template(v-for="msg in messages")

            //- chat-msg-date

            chat-msg-product(
              v-if="msg.parts[0].mime_type === 'text/json'",
              :msg="msg",
              :last-read-message-id="lastReadMessageId")

            chat-msg(
              v-if="msg.parts[0].mime_type === 'text/plain'",
              :msg="msg",
              :last-read-message-id="lastReadMessageId")

      chat-bar
</template>

<script type="text/babel">
  import {
    getChat,
    getLead,
    setOpenedChat,
  } from 'vuex/actions';

  import {
    currentChat,
    currentChatMember,
    chatNotifyCount,
  } from "vuex/getters";

  import store from 'vuex/store';
  import * as service from 'services/chat';
  import * as messages from 'services/message';

  import ChatMsgProduct from './chat-msg-product.vue';
  import ChatMsgDate from './chat-msg-date.vue';
  import ChatMsg from './chat-msg.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';

  export default {
    route: {
      data({to: {params: { id }}}) {
        // Listen messagess
        messages.onMsg(this.onMsg);

        this.getChat(+id).then( () => {

          this.setOpenedChat(+id);

          this.$nextTick(this.goToBottom);

        }).catch( error => {

          this.$router.go({name: '404'});
        });

      },
    },

    vuex: {
      actions: {
        getChat,
        getLead,
        setOpenedChat,
      },

      getters: {
        currentChat,
        currentChatMember,
        chatNotifyCount,
      }
    },

    computed: {
      messages() {
        return this.currentChat ? this.currentChat.messages : [];
      },

      lastReadMessageId() {
        let ids = this.currentChat.members
          .filter(member => member.user_id !== this.currentChatMember.user_id)
          .map(member => member.last_message_id)
          .sort((a, b) => a - b);

        return ids[0] // min last message id of all members (execept current)
      },
    },

    beforeDestroy() {
      messages.removeListenerMsg(this.onMsg);
    },

    methods: {
      goToBottom(){
        window.scrollTo(0, document.body.scrollHeight);
      },

      onMsg(r){
        if (this.currentChat && r.response_map.chat.id === this.currentChat.id) {
          this.$nextTick(this.goToBottom);
        }
      }
    },

    components: {
      ChatHeader,
      ChatBar,
      ChatMsg,
      ChatMsgProduct,
      ChatMsgDate,
    },

    watch: {
      messages() {
        let count = this.messages.length;

        if(count) {
          let msg = this.messages[count - 1];

          if(this.currentChatMember.last_message_id !== msg.id) {
            messages.update(msg.conversation_id, msg.id)
          }
        }
      }
    }
  }
</script>