<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  .chat-bar.section__content
    .chat-bar_menu-btn(v-if="isAdmin", @click="menuActive=true")
      i.ic-menu-light
    .chat-bar_input
      textarea(placeholder="Введите сообщение",
      v-model="txtMsg", v-el:input-msg
      @keydown.enter.prevent="send($event)")
    .chat-bar_send-btn(@click.prevent="send($event)", :class="{'__active': !!txtMsg}")
      i.ic-send-plane

  chat-menu(v-if="isAdmin", :menu-active.sync="menuActive")

</template>

<script type="text/babel">
  import { currentLead } from 'vuex/getters';
  import {
    getConversationId,
    getCurrentMember
  } from 'vuex/getters/chatGetters.js'
  import {
    setLeadStatus,
  } from "vuex/actions";
  import { createChatMsg } from "vuex/actions/chatActions.js";

  import * as service from "services/message";
  import * as leads from "services/leads";

  import ChatMenu from './chat-menu.vue';

  export default{
    data: () => ({
      menuActive: false,
      txtMsg: "",
      saveScrollPos: 0,
    }),

    vuex: {
      actions: {
        createChatMsg,
        setLeadStatus,
      },
      getters: {
        currentLead,
        getConversationId,
        getCurrentMember,
      }
    },

    computed: {
      isAdmin() {
        if (!this.getCurrentMember) {
          return false;
        }
        if (this.getCurrentMember.role === leads.USER_ROLES.SUPPLIER.key
                || this.getCurrentMember.role === leads.USER_ROLES.SELLER.key
                || this.getCurrentMember.role === leads.USER_ROLES.SUPER_SELLER.key) {
          return true;
        }
        return false;
      },
    },

    methods: {
      send (event) {
        this.$els.inputMsg.focus();
        event.preventDefault();

        var _txtMsg = this.txtMsg.trim();
        this.txtMsg = "";
        if (!_txtMsg.length) return;

        this.createChatMsg(getConversationId, _txtMsg, "text/plain")
        .then( () => {

          this.$nextTick(this.goToBottom);

          if (this.currentLead.status === leads.STATUSES.NEW.key
            && this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key) {
            this.setLeadStatus(this.currentLead.id, 'PROGRESS');
          }

        }).catch( error => {
          alert(error)
        });
      },
      goToBottom (){
        window.scrollTo(0, document.body.scrollHeight);
      },
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