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
        if (window.scrollY === 0) {
          return;
        }

        if (this.windowScrollY
          && this.windowScrollY.min !== window.scrollY
          && this.windowScrollY.msx !== window.scrollY) {
          return window.scrollTo(0, this.windowScrollY.last);
        }

        // Magic numbers
        var devices = [
          {min:446, max:510, diff:19}, // iphone 6 plus, 6s plus
          {min:470, max:536, diff:20}, // iphone 6, 6s
          {min:548, max:616, diff:24}, // iphone 5, 4s
        ]
        if (window.browser.iphone) {

          for (var item of devices) {
            if (window.scrollY === item.min) {

              item.last = item.min - item.diff
              this.windowScrollY = item;
              return window.scrollTo(0, item.last);

            } else if (window.scrollY === item.max) {

              item.last = item.max - item.diff
              this.windowScrollY = item;
              return window.scrollTo(0, item.last);

            }
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
          this.scrollEvent = listen(window, 'scroll', this.normalizeScroll.bind(this));
        }
      },
      send (e) {
        e.stopPropagation();
        e.preventDefault();

        const txtMsg = this.txtMsg.trim();
        if ( !txtMsg.length ) {
          return;
        }
        const promise = this.createMessage( this.getId, txtMsg, "text/plain" );
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