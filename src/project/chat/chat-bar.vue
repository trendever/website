<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  .chat-bar.section__content
    .chat-bar_menu-btn(@click="setShowMenu(true)")
      i.ic-menu-light
    .chat-bar_input
      textarea(placeholder="Введите сообщение", v-model="txtMsg", v-el:input-msg)
    .chat-bar_send-btn(@click.prevent="send($event)", :class="{'__active': !!txtMsg}")
      i.ic-send-plane

  chat-menu

</template>

<script type="text/babel">
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
      addNewLine(){
        this.stringWillSend = this.txtMsg.trim().split( '\n' ).reduce( ( prevValue, item ) => {
          return prevValue + `${item}<br>`
        }, '' );
        this.stringWillSend = `<p>${this.stringWillSend}</p>`.trim();
      },
      send () {
        this.$els.inputMsg.focus();
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
          const textHeight = 58;
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