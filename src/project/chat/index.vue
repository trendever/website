<style src='./styles/chat.pcss'></style>
<template lang="jade">
#chat
  scroll-component(class="chat-cnt")
    .loader-center(v-if="showLoader"): app-loader
    //-popup-img(v-if="imgPopUpUrl", :url="imgPopUpUrl", :width="imgWidth", :height="imgHeight", :on-close="closePopUp")
    chat-header(:notify-count='conversationNotifyCount')
    .chat-shadow(v-if="isMobile && getShowMenu || isMobile && getShowStatusMenu")
    .section.top.bottom
      .chat.section__content
        .chat_messages(id="chatmessages")
          div(v-for='(msg, index) in list', :key='index')
            div
              chat-msg-status(
                v-if='msg.parts[0].mime_type === "json/status"',
                :msg='msg')
              chat-msg-product-old(
                v-if='msg.parts[0].mime_type === "text/json"',
                :msg='msg')
              chat-msg-product(
                v-if='msg.parts[0].mime_type === "text/plain" && hasData(msg) ',
                :msg='msg')
              chat-msg(
                v-if='msg.parts[0].mime_type === "text/plain" && !hasData(msg)',
                :msg='msg')
              chat-msg-info(
                v-if='msg.parts[0].mime_type === "text/html"',
                :msg='msg')
              chat-msg-img(
                v-if='isImage(msg.parts[0].mime_type)',
                :msg='msg')
              chat-msg-payment(
                v-if='msg.parts[0].mime_type === "json/payment" || msg.parts[0].mime_type === "json/cancel_order"', :msg='msg')
            chat-msg-order(
                v-if='msg.parts[0].mime_type === "json/order"',
                :msg='msg')

    chat-bar
  scroll-top(:to-up="false")
</template>

<script type='text/babel'>
  import appLoader from 'base/loader/loader';
  import listen from 'event-listener';
  import scrollTop from 'base/scroll-top/scroll-top.vue';
  //actions
  import {
    setConversation,
    loadMessage,
    closeConversation,
    openPopUp,
    setConversationAction
  } from 'vuex/actions/chat.js';
  import { clearNotify } from 'vuex/actions/lead.js';

  //getters
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

  //services
  import * as messages from 'services/message';
  import * as leads from 'services/leads';

  import ScrollComponent from 'base/scroll/scroll.vue'
  //components
  import ChatMsgOrder from './chat-msg-order.vue';
  import ChatMsgPayment from './chat-msg-payment.vue';
  import ChatMsgProduct from './chat-msg-product.vue';
  import ChatMsgProductOld from './chat-msg-product-old.vue';
  import ChatMsgStatus from './chat-msg-status.vue';
  import ChatMsg from './chat-msg.vue';
  import ChatMsgImg from './chat-msg-img.vue';
  import ChatMsgInfo from './chat-msg-info.vue';
  import ChatBar from './chat-bar.vue';
  import ChatHeader from './chat-header.vue';
  //-import popupImg from 'base/popup-img/index.vue';

  export default {

    components: {
      ScrollComponent,
      //-popupImg,
      ChatHeader,
      ChatBar,
      ChatMsg,
      ChatMsgOrder,
      ChatMsgPayment,
      ChatMsgProduct,
      ChatMsgProductOld,
      ChatMsgStatus,
      ChatMsgImg,
      ChatMsgInfo,
      scrollTop,
      appLoader,
    },

    data(){
      return {
        needLoadMessage: true,
        lead_id: null,
        isMobile: window.browser.mobile,
        showLoader: true,
        scrollCnt: ''
      }
    },

    watch: {
      isDone( done ){
        if ( done ) {
          return this.run();
        }
      }
    },

    beforeRouteEnter ( to, from, next) {

      next(vm => {
        vm.lead_id = +to.params.id;
          if ( vm.isDone ) {
            if ( vm.isAuth ) {
              return vm.run().then(()=>{
                vm.clearNotify(vm.lead_id);
                vm.$nextTick( () => {
                        vm.goToBottom();
                      } );
              })
            } else {
              return Promise.resolve()
            }
          }
      })
    },
    mounted(){


      if ( this.isAuth ) {

        this.$nextTick(()=>{
          this.scrollCnt = document.querySelector('.scroll-cnt');
          this.onMessage      = this.onMessage.bind( this );
          this.scrollListener = listen( this.scrollCnt, 'scroll', this.scrollHandler.bind( this ) );
          messages.onMsg( this.onMessage );

        })

      } else {
        this.$router.push( { name: 'signup' } );
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

    computed:{

      list(){

        const end   = this.getMessages.length;

        const start = end - this.getLengthList - 1; // -1 потому что есть первое сообщение с датой.

        return this.getMessages.slice( (start <= 0) ? 0 : start, end );
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
              this.$router.push( { name: 'home' } );
            }
          ).then(()=>{
            //redirect if no chat room
            if(this.$store.state.conversation.id === null){
              this.$router.push( { name: '404'});
            }
          }).then(()=>{

            return messages
              .find(this.getId, null, 70, false)
              .then((data)=>{
                return data.find(message=>{
                  return message.parts[0].content === 'Привет;) да, подтверждаю!'
                })
              });

          }).then(flagMessage=>{
            if(!flagMessage && this.getCurrentMember.role === 1){
              this.setConversationAction('approve');
            }
          }).then(()=>{

            this.showLoader = false;
          });
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

                        add( this.scrollCnt.scrollHeight )

                      } );

                    }

                  });

             } else {

              resolve();

             }

          };

          this.$nextTick( () => {

            add( this.scrollCnt.scrollHeight )

          } );

        });

      },

      onMessage(){
        this.$nextTick( this.goToBottom );
      },

      isImage( mime ){
        return mime.indexOf( 'image' ) !== -1;
      },

      hasData(msg){
        if (msg.parts[1] && msg.parts[1].mime_type === 'text/data'){
          return true;
        }
        return false;
      },

      scrollHandler(){
        /*const SHAfter = this.scrollCnt.scrollHeight;

        if ( this.needLoadMessage ) {
          if ( this.scrollCnt.scrollTop < 1500 ) {

            this.$set( 'needLoadMessage', false );

            this.loadMessage().then( ( messages ) => {
              this.$nextTick( () => {

                if ( messages !== null ) {

                  const SHDelta                 = this.scrollCnt.scrollHeight - SHAfter;
                  const percentTopOfHeight      = (this.scrollCnt.scrollTop + SHDelta) / this.scrollCnt.scrollHeight;
                  this.scrollCnt.scrollTop = percentTopOfHeight * this.scrollCnt.scrollHeight;
                  this.$set( 'needLoadMessage', true );

                }

              } );
            } );

          }
        }*/

      },
      goToBottom(){
        this.scrollCnt.scrollTop = this.scrollCnt.scrollHeight;
      }
    },
  }
</script>
