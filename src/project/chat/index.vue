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

            chat-msg-product(v-if="msg.parts[0].mime_type === 'text/json'", :msg="msg")
            chat-msg(v-if="msg.parts[0].mime_type === 'text/plain'", :msg="msg")

      chat-bar
</template>

<script type="text/babel">
  import {
    getChat,
    setOpenedChat,
  } from 'vuex/actions';
  import {
    currentChat,
    chatNotifyCount,
  } from "vuex/getters";

  import * as service from 'services/chat';
  import * as messages from 'services/message';

  import ChatMsgProduct from './chat-msg-product.vue';
  import ChatMsgDate from './chat-msg-date.vue';
  import ChatMsg from './chat-msg.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';

  export default {
    data() {
      return {
        lastReadMessages: {}
      }
    },

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
        setOpenedChat,
      },

      getters: {
        currentChat,
        chatNotifyCount,
      }
    },

    computed: {
      messages() {
        return this.currentChat ? this.currentChat.messages : [];
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

          if(this.lastReadMessages[msg.conversation_id] !== msg.id) { // TODO: check data from server
            messages
              .update(msg.conversation_id, msg.id)
              .then(ok => {
                ok && (this.lastReadMessages[msg.conversation_id] = msg.id);
              });
          }
        }
      }
    }
  }
</script>