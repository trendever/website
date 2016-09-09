<style src='./styles/chat.pcss'></style>
<template lang="jade">
  scroll-component(v-el:scroll-cnt, class="chat-cnt")
    popup-img(v-if="imgPopUpUrl", :url="imgPopUpUrl", :width="imgWidth", :height="imgHeight", :on-close="closePopUp")
    chat-header(:notify-count='conversationNotifyCount')
    .chat-shadow(v-if="getShowMenu || getShowStatusMenu")
    .section.top.bottom
      .chat.section__content
        .chat_messages
          div(v-for='msg in getMessages | list', track-by='$index')
            chat-msg-status(
              v-if='msg.parts[0].mime_type === "json/status"',
              :msg='msg')
            chat-msg-product(
              v-if='msg.parts[0].mime_type === "text/json"',
              :msg='msg')
            chat-msg(
              v-if='msg.parts[0].mime_type === "text/plain"',
              :msg='msg')
            chat-msg-info(
              v-if='msg.parts[0].mime_type === "text/html"',
              :msg='msg')
            chat-msg-img(
              v-if='isImage(msg.parts[0].mime_type)',
              :msg='msg')

    chat-bar
  scroll-top(:to-up="false")
</template>

<script type='text/babel'>
  import listen from 'event-listener';
  import scrollTop from 'base/scroll-top/scroll-top.vue';
  import {
    setConversation,
    loadMessage,
    closeConversation,
    openPopUp,
    setConversationAction
  } from 'vuex/actions/chat.js';
  import {
    getMessages,
    conversationNotifyCount,
    getId,
    getCurrentMember,
    getLengthList,
    getShowMenu,
    getShowStatusMenu,
    imgPopUpUrl,
    imgWidth,
    imgHeight
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
  import ChatMsgInfo from './chat-msg-info.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';
  import popupImg from 'base/popup-img/index.vue';

  export default {

    components: {
      ScrollComponent,
      popupImg,
      ChatHeader,
      ChatBar,
      ChatMsg,
      ChatMsgProduct,
      ChatMsgStatus,
      ChatMsgImg,
      ChatMsgInfo,
      scrollTop
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
        setConversationAction,
        setConversation,
        loadMessage,
        clearNotify,
        closeConversation,
        openPopUp
      },
      getters: {
        imgPopUpUrl,
        imgWidth,
        imgHeight,
        isAuth,
        isDone,
        getMessages,
        conversationNotifyCount,
        getId,
        getCurrentMember,
        getLengthList,
        getShowMenu,
        getShowStatusMenu
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

      closePopUp(){

        this.openPopUp();

      },

      run(){
        return this
          .setConversation( this.lead_id )
          .then(
            () => {
                    this.$nextTick( () => {
                      this.goToBottom();
                    } );
            },
            ( error ) => {
              console.error( `[ CONVERSATION_SET ERROR ]: `, error );
              this.$router.go( { name: 'home' } );
            }
          ).then(()=>{
            //redirect if no chat room
            if(this.$store.state.conversation.id === null){
              this.$router.go( { name: '404'});
            }
          }).then(()=>{
            //show approve btn if first chat
            return this.getMessages.find(message=>{
              return message.parts[0].mime_type === 'text/plain' && message.user.user_id === this.$store.state.user.myId;

            })

          }).then(flagMessage=>{
            if(!flagMessage && this.getCurrentMember.role === 1){
              this.setConversationAction('approve');
            }
          })
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
        /*const SHAfter = this.$els.scrollCnt.scrollHeight;

        if ( this.needLoadMessage ) {
          if ( this.$els.scrollCnt.scrollTop < 1500 ) {

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
        }*/

      },
      goToBottom(){
        this.$els.scrollCnt.scrollTop = this.$els.scrollCnt.scrollHeight;
      }
    },
  }
</script>
