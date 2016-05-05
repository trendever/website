<style src="./styles/chat.pcss"></style>
<template lang="jade">
div
  .chat-cnt
    chat-header(:notify-count='conversationNotifyCount')
    .section.top.bottom
      .chat.section__content(v-el:message-list)
        .chat_messages
          template(v-for="msg in getMessages")

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
  import {
          setConversation,
          loadMessage
  } from 'vuex/actions/chatActions.js';
  import {
          getMessages,
          conversationNotifyCount
  } from "vuex/getters/chatGetters.js";
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
        this.setConversation( conversation_id ).then(() => {
          this.$nextTick(this.goToBottom);
        });
      },
    },
    vuex: {
      actions: {
        setConversation,
        loadMessage,
      },
      getters: {
        getMessages,
        conversationNotifyCount,
      },
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
          if ( window.scrollY <= 50 ) {
            needUpdate         = true;
            const listElement  = this.$els.messageList;
            const heightBefore = listElement.scrollHeight;
            this.loadMessage().then( ( messages ) => {
              this.$nextTick( () => {
                if ( messages !== null ) {
                  window.scrollTo( 0, listElement.scrollHeight - heightBefore );
                }
              } );
            } );
          }
        }
        if ( needUpdate ) {
          this.offScroll();
          setTimeout( () => {
            needUpdate = false;
            this.onScroll();
          }, 100 );
        }
      },
      goToBottom(){
        console.info(this.$els.messageList.scrollHeight);
        window.scrollTo(0, this.$els.messageList.scrollHeight);
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