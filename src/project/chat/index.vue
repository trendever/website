<style src="./styles/chat.pcss"></style>
<template lang="jade">
div
  .chat-cnt
    chat-header(:notify-count='23')
    .section.top.bottom
      .chat.section__content(v-el:message-list)
        .chat_messages
          template(v-for="msg in getMessages", track-by="$index")

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
          loadMessage,
          receiveMessage
  } from 'vuex/actions/chatActions.js';
  import {
          getMessages,
          conversationNotifyCount,
          getConversationId,
          getCurrentMember
  } from "vuex/getters/chatGetters.js";
  import * as messages from 'services/message';
  import ChatMsgProduct from './chat-msg-product.vue';
  import ChatMsgDate from './chat-msg-date.vue';
  import ChatMsg from './chat-msg.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';

  export default {
    created() {
      messages.onMsg(this.onMessage);
      messages.onMsgRead(this.onMessageReaded);
    },
    ready(){
      this.onScroll();
    },
    beforeDestroy() {
      this.offScroll();
      messages.offMsg(this.onMessage);
      messages.offMsgRead(this.onMessageReaded);
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
        receiveMessage
      },
      getters: {
        getMessages,
        conversationNotifyCount,
        getConversationId,
        getCurrentMember,
      },
    },
    computed: {
    },
    methods: {
      onScroll(){
        this.scrollListener = listen( window, 'scroll', this.scrollHandler.bind( this ) );
      },
      offScroll(){
        this.scrollListener.remove();
      },
      onMessage({response_map: {chat, messages}}){
        if (chat.id === this.getConversationId) {
          this.receiveMessage(messages[0]);
          this.$nextTick(this.goToBottom);
        }
      },
      onMessageReaded({response_map: {chat, message_id, user_id}}){
        let isCurrentChat = chat.id === this.getConversationId;
        let isNotCurrentUser = user_id !== this.getCurrentMember.user_id;
        if (isCurrentChat && isNotCurrentUser) {
          this.setMessageRead(message_id, chat.members.find(member => member.user_id === user_id));
        }
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
        window.scrollTo(0, this.$els.messageList.scrollHeight);
      },
    },
    components: {
      ChatHeader,
      ChatBar,
      ChatMsg,
      ChatMsgProduct,
      ChatMsgDate,
    }
  }
</script>