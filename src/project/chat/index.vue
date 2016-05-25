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
          receiveMessage,
          updateMembers,
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

    data(){
      return {
        needLoadMessage: true
      }
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
              this.goToBottom();
            } );
          },
          () => {
            this.$router.go( { name: 'home' } );
          }
        );
      },
    },
    ready(){
      this.scrollListener = listen( this.$els.scrollCnt, 'scroll', this.scrollHandler.bind( this ) );
    },
    beforeDestroy() {
      leads.removeStatusListener( this.onStatus );
      messages.offMsg( this.onMessage );
      messages.offMsgRead( this.onMessageReaded );
      this.scrollListener.remove();
    },
    vuex: {
      actions: {
        setConversation,
        loadMessage,
        receiveMessage,
        updateMembers,
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
      isImage(mime){
        return mime.indexOf('image') !== -1;
       },
      onStatus({response_map: {lead}})  {
        this.applyStatus(lead.status);
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
        /**
         * TODO
         * В https://web.whatsapp.com/, они выводят спинер когда долистали ровно до верха.
         * Если делать с расстоянием от верха, то я пока что не понимаю как сделать нормально для телефона.
         * Всё ровно если на телкфоне быстро промотать, то упираешься в верх и ждёшь без спинера, не очень.
         * Я за спинер.
         * В вебограме тоже спинер.
         * */
        const SHAfter = this.$els.scrollCnt.scrollHeight;
        if ( this.needLoadMessage ) {
          if ( this.$els.scrollCnt.scrollTop  < 1500 /*=== 0 */) {
            this.$set( 'needLoadMessage', false );
            this.loadMessage().then( ( messages ) => {
              this.$nextTick( () => {
                if ( messages !== null ) {
                  const SHDelta = this.$els.scrollCnt.scrollHeight - SHAfter;
                  const percentTopOfHeight =  (this.$els.scrollCnt.scrollTop + SHDelta)  / this.$els.scrollCnt.scrollHeight;
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
    watch: {
      getMessages(){
        console.log( this );
      }
    }
  }
</script>
