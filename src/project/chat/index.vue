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
    setMessageRead
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

  import find from 'lodash/find'

  export default {
    route: {
      data({to: {params: { id }}}) {

        this.getChat(+id).then( () => {
          this.setOpenedChat(+id);
          this.updateLastMessageId();
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
        setMessageRead
      },

      getters: {
        currentChat,
        currentChatMember,
        chatNotifyCount,
      }
    },

    created() {
      messages.onMsg(this.onMsg);
      messages.onMsgRead(this.onMsgRead);
    },

    computed: {
      messages() {
        return this.currentChat ? this.currentChat.messages : [];
      },

      lastReadMessageId() {
        let ids = this.currentChat.members
          .filter(member => member.user_id !== this.currentChatMember.user_id)
          .map(member => member.last_message_id)
          .sort((a, b) => b - a);

        // max last message id of all members except current,
        // i.e. if someone except current user read message it'll marked as read
        return ids[0]
      }
    },

    beforeDestroy() {
      messages.removeListenerMsg(this.onMsg);
      messages.removeListenerMsgRead(this.onMsgRead);
    },

    methods: {
      goToBottom(){
        window.scrollTo(0, document.body.scrollHeight);
      },

      onMsg({response_map: {chat}}){
        let isCurrentChat = this.currentChat && chat.id === this.currentChat.id;

        if (isCurrentChat) {
          this.$nextTick(this.goToBottom);
        }
      },

      onMsgRead({response_map: {chat, messages: message_id, user_id}}) {
        let isCurrentChat = this.currentChat && chat.id === this.currentChat.id;
        let isNotCurrentUser = user_id !== this.currentChatMember.user_id;

        if (isCurrentChat && isNotCurrentUser) {
          let {id, members} = chat;
          let member = find(members, {user_id});

          member.last_message_id = message_id; // fix not updated last_message_id

          this.setMessageRead({id, members});
        }
      },

      updateLastMessageId() {
        let count = this.messages.length;

        if(count) {
          let msg = this.messages[count - 1];
          let isNotCurrentUserMessage = this.currentChatMember.user_id !== msg.user.user_id;
          let isNotLastMessage = this.currentChatMember.last_message_id !== msg.id;

          if(isNotCurrentUserMessage && isNotLastMessage) {
            messages.update(msg.conversation_id, msg.id);
          }
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
        this.updateLastMessageId()
      }
    }
  }
</script>