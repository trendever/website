<style src='./styles/chat.pcss'></style>
<template lang="jade">
  scroll-component(v-el:scroll-cnt, class="chat-cnt")
    chat-header(:notify-count='conversationNotifyCount')
    .section.top.bottom
      .chat.section__content
        .chat_messages
          template(v-for='msg in getMessages | list', track-by='$index')
            chat-msg-status(
              v-if='msg.parts[0].mime_type === "json/status"',
              :msg='msg')
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
    closeConversation,
  } from 'vuex/actions/chat.js';
  import {
    getMessages,
    conversationNotifyCount,
    getId,
    getCurrentMember,
    getLengthList
  } from 'vuex/getters/chat.js';
  import { isDone } from 'vuex/getters/lead.js';
  import { isAuth } from 'vuex/getters/user.js';
  import { clearNotify } from 'vuex/actions/lead.js';

  import * as messages from 'services/message';
  import * as leads from 'services/leads';

  import ScrollComponent from 'base/scroll/scroll.vue'

  import ChatMsgProduct from './chat-msg-product.vue';
  import ChatMsgStatus from './chat-msg-status.vue';
  import ChatMsg from './chat-msg.vue';
  import ChatMsgImg from './chat-msg-img.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';

  export default {

    components: {
      ScrollComponent,

      ChatHeader,
      ChatBar,
      ChatMsg,
      ChatMsgProduct,
      ChatMsgStatus,
      ChatMsgImg
    },

    data(){
      return {
        needLoadMessage: true,
        lead_id: null
      }
    },

    watch: {
      isDone( done ){
        if ( done ) {
          return this.run();
        }
      }
    },

    route: {
      data( { to: { params: { id:lead_id } } } ) {
        this.$set( 'lead_id', +lead_id );
        if ( this.isDone ) {
          if ( this.isAuth ) {
            return this.run();
          } else {
            return Promise.resolve()
          }
        }
      },
    },

    ready(){
      if ( this.isAuth ) {
        this.onMessage      = this.onMessage.bind( this );
        this.scrollListener = listen( this.$els.scrollCnt, 'scroll', this.scrollHandler.bind( this ) );
        messages.onMsg( this.onMessage );
      } else {
        this.$router.go( { name: 'signup' } );
      }
    },

    beforeDestroy() {
      if ( this.isAuth ) {
        this.scrollListener.remove();
        this.closeConversation();
        messages.offMsg( this.onMessage );
      }
    },

    vuex: {
      actions: {
        setConversation,
        loadMessage,
        clearNotify,
        closeConversation,
      },
      getters: {
        isAuth,
        isDone,
        getMessages,
        conversationNotifyCount,
        getId,
        getCurrentMember,
        getLengthList
      },
    },

    filters: {
      list( value ){

        const end   = value.length;
        const start = end - this.getLengthList - 1; // -1 потому что есть первое сообщение с датой.
        return value.slice( (start <= 0) ? 0 : start, end );
      }
    },

    methods: {

      run(){
        return this
          .setConversation( this.lead_id )
          .then(
            () => {
              this.clearNotify( this.lead_id );
                this
                  .runLoadingMessage()
                  .then( () => {
                    this.$nextTick( () => {
                      this.goToBottom();
                    } );
                  } );
            },
            ( error ) => {
              console.error( `[ CONVERSATION_SET ERROR ]: `, error );
              this.$router.go( { name: 'home' } );
            }
          );
      },

      runLoadingMessage(){

        return new Promise((resolve, reject) => {

          const add = ( scrollHeight ) => {

             if ( document.body.offsetHeight >= scrollHeight ) {

                this
                  .loadMessage()
                  .then( ( messages ) => {

                    if ( messages === null ) {

                      resolve();

                    } else {

                      this.$nextTick( () => {

                        add( this.$els.scrollCnt.scrollHeight )

                      } );

                    }

                  });

             } else {

              resolve();

             }

          };

          this.$nextTick( () => {

            add( this.$els.scrollCnt.scrollHeight )

          } );

        });

      },

      onMessage(){
        this.$nextTick( this.goToBottom );
      },

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
      }
    },
  }
</script>
