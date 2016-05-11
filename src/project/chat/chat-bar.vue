<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  .chat-bar.section__content
    .chat-bar_menu-btn(v-if="isAdmin", @click="setShowMenu(true)")
      i.ic-menu-light
    .chat-bar_input
      textarea(placeholder="Введите сообщение",
      v-model="txtMsg", v-el:input-msg
      @keydown.enter.prevent="send($event)")
    .chat-bar_send-btn(@click.prevent="send($event)", :class="{'__active': !!txtMsg}")
      i.ic-send-plane

  chat-menu(v-if="isAdmin")

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

    computed: {
      isAdmin() {
        if (!this.getCurrentMember) {
          return false;
        }
        return !!(this.getCurrentMember.role === leads.USER_ROLES.SUPPLIER.key
        || this.getCurrentMember.role === leads.USER_ROLES.SELLER.key
        || this.getCurrentMember.role === leads.USER_ROLES.SUPER_SELLER.key);

      },
    },

    methods: {
      send ( event ) {

        this.$els.inputMsg.focus();
        //event.preventDefault(); ??? Вроде как @keydown.enter.prevent

        const txtMsg = this.txtMsg.trim();

        if ( !txtMsg.length ) return;

        const promise = this.createMessage( this.getId, txtMsg, "text/plain" );

        promise.then( () => {
          if (
            this.getStatus === leads.STATUSES.NEW.key &&
            this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key
          ) {
            this.setStatus( 'PROGRESS' );
          }
          this.txtMsg = "";
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
          inputMsg.style.height = (msg ? inputMsg.scrollHeight : 53)  + 'px';
        });

      }
    },

    components: {
      ChatMenu
    }
  }
</script>