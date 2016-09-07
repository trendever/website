<style src='./styles/chat-bar.pcss'></style>
<template lang="jade">

div
  .chat-approve-btn(v-if='getAction === "approve" && getCurrentMember.role === 1', @click='approveChat') ПОДТВЕРДИТЬ
  .chat-bar.section__content(v-else)
    .chat-bar_menu-btn(@click='setShowMenu(true)')
      i.ic-menu-light
    .chat-bar_input
      textarea(placeholder='Введите сообщение',
               v-model='txtMsg',
               v-el:input-msg,
               @focus='focusInput',
               @blur='blurInput($event)')
    .chat-bar_send-btn(v-on:mousedown='send($event)',
                       v-on:touchstart='send($event)',
                       :class='{"__active": !!txtMsg}')
      i.ic-send-plane
  chat-menu

</template>

<script type='text/babel'>
  import listen from 'event-listener'

  import store from 'vuex/store'
  import {
    getAction,
    getId,
    getCurrentMember,
    getStatus,
    getShowMenu
  } from 'vuex/getters/chat.js'

  import {
    setConversationAction,
    createMessage,
    setShowMenu,
    setStatus
  } from 'vuex/actions/chat.js'

  import * as service from 'services/message'
  import * as leads from 'services/leads'

  import ChatMenu from './chat-menu.vue'

  export default{
    data(){
      return {
        txtMsg: '',
      }
    },

    ready(){

      if ( !window.browser.mobile ) {

        this.sendMessage = listen( window, 'keydown', ( event ) => {

          if ( !event.shiftKey && event.keyCode === 13 ) {

            this.send( event )

          }
          if ( event.shiftKey && event.keyCode === 13 ) {

            this.$set( 'txtMsg', this.txtMsg )

          }

        } )

      }

    },

    beforeDestroy() {
      if ( this.scrollEvent ) {
        this.scrollEvent.remove()
      }
      if ( this.sendMessage ) {
        this.sendMessage.remove()
      }
    },

    vuex: {
      actions: {
        setConversationAction,
        createMessage,
        setShowMenu,
        setStatus
      },
      getters: {
        getAction,
        getId,
        getCurrentMember,
        getShowMenu,
        getStatus
      }
    },

    methods: {
      normalizeScroll() {
        // Hard hack for ios jumping, why open keyboard
        if ( window.scrollY === 0 ) {
          return
        }

        if ( this.windowScrollY
          && this.windowScrollY.min !== window.scrollY
          && this.windowScrollY.msx !== window.scrollY ) {
          return window.scrollTo( 0, this.windowScrollY.last )
        }

        // Magic numbers
        // disabled autocomplete
        // var devices = [
        //   { min: 446, max: 510, diff: 19 }, // iphone 6 plus, 6s plus
        //   { min: 470, max: 536, diff: 20 }, // iphone 6, 6s
        //   { min: 548, max: 616, diff: 24 } // iphone 5, 4s
        // ]

        // enabled autocomplete
        var devices = [
          { min: 446, max: 510, diff: 19 }, // iphone 6 plus, 6s plus
          { min: 452, max: 536, diff: 20 }, // iphone 6, 6s
          { min: 530, max: 616, diff: 24 } // iphone 5, 4s
        ]

        if ( window.browser.iphone ) {

          for ( var item of devices ) {
            if ( window.scrollY === item.min ) {

              item.last          = item.min - item.diff
              this.windowScrollY = item
              return window.scrollTo( 0, item.last )

            } else if ( window.scrollY === item.max ) {

              item.last          = item.max - item.diff
              this.windowScrollY = item
              return window.scrollTo( 0, item.last )

            }
          }

        }
      },

      blurInput( event ){
        if ( window.browser.iphone ) {
          if ( this.scrollEvent ) {
            this.scrollEvent.remove()
          }
        }
      },

      focusInput(){
        if ( window.browser.iphone ) {
          this.normalizeScroll()
          this.scrollEvent = listen( window, 'scroll', this.normalizeScroll.bind( this ) )
        }
        if (window.browser.mobile){
          let hack = document.getElementById('chathack');
          hack.style.padding = "500px 0 0 0"
        }
      },

      send ( event ) {
        if(event) {

          event.stopPropagation()
          event.preventDefault()

        }

        const txtMsg = this.txtMsg.trim()
        if ( !txtMsg.length ) {
          return
        }

        this.txtMsg = ''

        const promise = this.createMessage( this.getId, txtMsg, 'text/plain' )
        promise.then( () => {
          if (
            this.getStatus === leads.STATUSES.NEW.key &&
            this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key
          ) {
            this.setStatus( 'PROGRESS', 'lead.state.changed' )
          }

          this.setConversationAction('base');

        } )

        promise.catch( ( { code, errData } ) => {
          this.txtMsg = txtMsg
          console.error( errData )

          // ToDo надо отображать, что сообщение не отправлено значком в сообщении
          alert( 'Ошибка. Сообщение не отправлено. Может нет интернета?' )

          console.error( new Error( 'Problem to send message' ), {
            extra: {
              errorMsg: errData,
              user: store.state.user
            }
          } )

        } )
      },
      approveChat(){

        this.txtMsg = 'Привет;) да, подтверждаю!';

        this.send();

      }
    },

    watch: {
      txtMsg( msg ) {
        this.$nextTick( () => {
          let inputMsg          = this.$els.inputMsg
          const textHeight      = window.matchMedia( '(max-width: 750px)' ).matches ? 58 : 32
          const inpHeight       = inputMsg.scrollHeight
          inputMsg.style.height = (msg ? (inpHeight <= textHeight) ? textHeight : inpHeight : textHeight) + 'px'
        } )

      }
    },

    components: {
      ChatMenu
    }
  }
</script>
