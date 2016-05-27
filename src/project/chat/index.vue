<style src='./styles/chat.pcss'></style>
<template lang="jade">
  .chat-cnt.scroll-cnt(v-el:scroll-cnt)
    chat-header(:notify-count='conversationNotifyCount')
    .section.top.bottom
      .chat.section__content
        .chat_messages
          //- chat-msg-date
          template(v-for='msg in getMessages', track-by='$index')
            chat-msg-product(
              v-if='msg.parts[0].mime_type === "text/json"',
              :msg='msg')
            chat-msg(
              v-if='msg.parts[0].mime_type === "text/plain"',
              :msg='msg')
            chat-msg-img(
              v-if='isImage(msg.parts[0].mime_type)',
              :msg='msg')

    chat-bar
</template>

<script type='text/babel'>
  import listen from 'event-listener';
  import {
    setConversation,
    loadMessage,
    closeConversation
  } from 'vuex/actions/chat.js';
  import {
    getMessages,
    conversationNotifyCount,
    getId,
    getCurrentMember,
  } from 'vuex/getters/chat.js';
  import {
    getLeads
  } from 'vuex/getters/lead.js';
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

    data(){
      return {
        needLoadMessage: true
      }
    },
    route: {
      data( { to: { params: { id:lead_id } } } ) {
        this.setConversation( +lead_id ).then(
          () => {
            this.clearNotify( +lead_id );
            this.$nextTick( () => {
              this.goToBottom();
            } );
          },
          ( error ) => {
            console.error( `[ CONVERSATION_SET ERROR ]: `, error );
            this.$router.go( { name: 'home' } );
          }
        );
      },
    },
    ready(){
      this.scrollListener = listen( this.$els.scrollCnt, 'scroll', this.scrollHandler.bind( this ) );
    },
    beforeDestroy() {
      this.scrollListener.remove();
      this.closeConversation();
    },
    vuex: {
      actions: {
        setConversation,
        loadMessage,
        clearNotify,
        closeConversation
      },
      getters: {
        getMessages,
        conversationNotifyCount,
        getId,
        getCurrentMember,
        getLeads
      },
    },
    methods: {

      isImage( mime ){
        return mime.indexOf( 'image' ) !== -1;
      },

      scrollHandler(){

        const SHAfter = this.$els.scrollCnt.scrollHeight;

        if ( this.needLoadMessage ) {
          if ( this.$els.scrollCnt.scrollTop < 1500 /*=== 0 */ ) {

            this.$set( 'needLoadMessage', false );

            this.loadMessage().then( ( messages ) => {
              this.$nextTick( () => {

                if ( messages !== null ) {

                  const SHDelta                 = this.$els.scrollCnt.scrollHeight - SHAfter;
                  const percentTopOfHeight      = (this.$els.scrollCnt.scrollTop + SHDelta) / this.$els.scrollCnt.scrollHeight;
                  this.$els.scrollCnt.scrollTop = percentTopOfHeight * this.$els.scrollCnt.scrollHeight;
                  this.$set( 'needLoadMessage', true );

                }

              } );
            } );

          }
        }

      },

      goToBottom(){
        this.$els.scrollCnt.scrollTop = this.$els.scrollCnt.scrollHeight;
      },

    },
    components: {
      ChatHeader,
      ChatBar,
      ChatMsg,
      ChatMsgProduct,
      ChatMsgDate,
      ChatMsgImg
    },
  }
</script>
