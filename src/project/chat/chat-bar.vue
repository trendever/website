<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  .chat-bar.section__content
    .chat-bar_menu-btn(@click="setShowMenu(true)")
      i.ic-menu-light
    .chat-bar_input
      textarea(placeholder="Введите сообщение",
               v-model="txtMsg",
               v-el:input-msg,
               @focus="focusInput",
               @blur="blurInput($event)")
    .chat-bar_send-btn(v-on:mousedown="send($event)",
                       v-on:touchstart="send($event)",
                       :class="{'__active': !!txtMsg}")
      i.ic-send-plane

  chat-menu

</template>

<script type="text/babel">
  import listen from 'event-listener';

  import {
    getId,
    getCurrentMember,
    getStatus,
    getShowMenu
  } from 'vuex/getters/chat.js';

  import {
    createMessage,
    setShowMenu,
    setStatus
  } from "vuex/actions/chat.js";

  import * as service from "services/message";
  import * as leads from "services/leads";

  import ChatMenu from './chat-menu.vue';

  export default{
    data(){
      return {
        txtMsg: "",
        stringWillSend: "",
      };
    },

    beforeDestroy() {
      if (this.scrollEvent) {
        this.scrollEvent.remove();
      }
    },

    vuex: {
      actions: {
        createMessage,
        setShowMenu,
        setStatus,
      },
      getters: {
        getId,
        getCurrentMember,
        getShowMenu,
        getStatus
      }
    },

    methods: {
      normalizeScroll() {
        // Hard hack for ios jumping, why open keyboard
        if (window.browser.iphone) {
          console.log(window.scrollY);
          if (window.scrollY === 446) {
             window.scrollTo(0, 427);
          } else if (window.scrollY === 510) {
            window.scrollTo(0, 491);
          }
        }
      },

      blurInput(event){
        if (window.browser.iphone) {
          if (this.scrollEvent) {
            this.scrollEvent.remove();
          }
        }
      },

      focusInput(){
        if (window.browser.iphone) {
          this.normalizeScroll();
          this.scrollEvent = listen(window, 'scroll', self.normalizeScroll.bind(this));
        }
      },

      addNewLine(){
        this.stringWillSend = this.txtMsg.trim().split( '\n' ).reduce( ( prevValue, item ) => {
          return prevValue + `${item}<br>`
        }, '' );
        this.stringWillSend = `<p>${this.stringWillSend}</p>`.trim();
      },
      send (e) {
        e.stopPropagation();

        const txtMsg = this.txtMsg.trim();
        this.addNewLine();
        if ( !txtMsg.length ) {
          return;
        }
        if ( this.stringWillSend.length <= 0 ) {
          this.stringWillSend = txtMsg;
        }
        const promise = this.createMessage( this.getId, this.stringWillSend, "text/plain" );
        promise.then( () => {
          if (
            this.getStatus === leads.STATUSES.NEW.key &&
            this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key
          ) {
            this.setStatus( 'PROGRESS' );
          }
          this.txtMsg         = "";
          this.stringWillSend = "";
        } );
        promise.catch( error => {
          console.log( error );
        } );
      }
    },

    watch: {
      txtMsg(msg) {
        this.$nextTick(() => {
          let inputMsg = this.$els.inputMsg;
          const textHeight = window.matchMedia("(max-width: 750px)").matches ? 58: 32;
          const inpHeight = inputMsg.scrollHeight;
          inputMsg.style.height = (msg ? (inpHeight <= textHeight)? textHeight: inpHeight : textHeight)  + 'px';
        });

      }
    },

    components: {
      ChatMenu
    }
  }
</script>