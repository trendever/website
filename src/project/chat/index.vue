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
  import listen from 'event-listener';
  import { setConversation, messageLoad } from 'vuex/actions/chatActions.js';
  //import {  } from "vuex/getters";
  import ChatMsgProduct from './chat-msg-product.vue';
  import ChatMsgDate from './chat-msg-date.vue';
  import ChatMsg from './chat-msg.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';

  export default {
    ready(){
      this.onScroll();
    },
    route: {
      data({to: {params: { id }}}) {
        const conversation_id = +id;
        this.setConversation( conversation_id );
      },
    },
    vuex: {
      actions: {
        setConversation,
        messageLoad,
      },
      getters: {},
    },
    computed: {
    },
    beforeDestroy() {
      this.scrollListener.remove();
    },
    methods: {
      onScroll(){
        this.scrollListener = listen( window, 'scroll', this.scrollHandler.bind( this ) );
      },
      offScroll(){
        this.scrollListener.remove();
      },
      scrollHandler(){
        let needUpdate = false;
        if ( !needUpdate ) {
          if ( window.scrollY <= 300 ) {
            needUpdate = true;
            this.messageLoad();
          }
        }
        if (needUpdate) {
          this.offScroll();
          setTimeout( () => {
            needUpdate = false;
            this.onScroll();
          }, 500 );
        }
      },
      goToBottom(){
        window.scrollTo(0, document.body.scrollHeight);
      },
    },

    components: {
      ChatHeader,
      ChatBar,
      ChatMsg,
      ChatMsgProduct,
      ChatMsgDate,
    },
  }
</script>