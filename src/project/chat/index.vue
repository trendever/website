<style src="./styles/chat.pcss"></style>
<template lang="jade">
div
  .chat-cnt
    chat-header(:notify-count='conversationNotifyCount')
    .section.top.bottom
      .chat.section__content
        .chat_messages
          template(v-for="msg in getMessages", track-by="$index")

            //- chat-msg-date

            chat-msg-product(
              v-if="msg.parts[0].mime_type === 'text/json'",
              :msg="msg")

            chat-msg(
              v-if="msg.parts[0].mime_type === 'text/plain'",
              :msg="msg")

            chat-msg-img(
              v-if="msg.parts[0].mime_type === 'image/json'",
              :msg="msg")

      chat-bar
</template>

<script type="text/babel">
  import listen from 'event-listener';
  import {
          setConversation,
          loadMessage,
          receiveMessage,
          updateMembers,
          closeConversation,
          applyStatus
  } from 'vuex/actions/chat.js';
  import {
          getMessages,
          conversationNotifyCount,
          getId,
          getCurrentMember,
  } from 'vuex/getters/chat.js';
  import { clearNotify } from 'vuex/actions/lead.js';

  import * as messages from 'services/message';
  import * as leads from 'services/leads';

  import ChatMsgProduct from './chat-msg-product.vue';
  import ChatMsgDate from './chat-msg-date.vue';
  import ChatMsg from './chat-msg.vue';
  import ChatMsgImg from './chat-msg-img.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';

  export default {
    beforeDestroy() {
      leads.removeStatusListener(this.onStatus);
      this.offScroll();
      messages.offMsg(this.onMessage);
      messages.offMsgRead(this.onMessageReaded);
      this.closeConversation();
    },
    route: {
      data({to: {params: { id }}}) {
        this.setConversation( +id ).then(
          () => {
            this.clearNotify( +id );
            this.$nextTick( () => {
              this.onStatus = this.onStatus.bind(this);
              leads.onChangeStatus(this.onStatus);
              messages.onMsg(this.onMessage);
              messages.onMsgRead(this.onMessageReaded);
              this.onScroll();
              this.goToBottom();
            } );
          },
          () => {
            this.$router.go( { name: 'home' } );
          }
        );
      },
    },
    vuex: {
      actions: {
        setConversation,
        loadMessage,
        receiveMessage,
        updateMembers,
        closeConversation,
        applyStatus,
        clearNotify
      },
      getters: {
        getMessages,
        conversationNotifyCount,
        getId,
        getCurrentMember,
      },
    },
    methods: {
      onStatus({response_map: {lead}})  {
        this.applyStatus(lead.status);
      },
      onScroll(){
        this.scrollListener = listen( window, 'scroll', this.scrollHandler.bind( this ) );
      },
      offScroll(){
        this.scrollListener.remove();
      },
      onMessage( { response_map: { chat, messages } } ){
        const promise = this.receiveMessage( chat, messages );
        promise.then( () => {
          this.$nextTick( this.goToBottom );
        } );
        promise.catch( ( error ) => {
          console.log( error );
        } );
      },
      onMessageReaded({response_map: {chat, user_id}}){
        this.updateMembers(user_id, chat);
      },
      scrollHandler(){

        let needUpdate = false;

        if ( !needUpdate ) {

          const pos_scroll = window.pageYOffset || document.documentElement.scrollTop;

          if ( pos_scroll < 1500 ) {

            needUpdate = true;
            this.offScroll();

            const heightBefore = document.body.scrollHeight;

            this.loadMessage().then( ( messages ) => {
              this.$nextTick( () => {

                const heightAfter = document.body.scrollHeight;

                if ( messages !== null ) {

                  needUpdate = false;
                  window.scrollTo( 0, heightAfter - heightBefore + pos_scroll );
                  this.onScroll();

                }

              } );
            } );
          }
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
      ChatMsgImg
    }
  }
</script>