<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  .chat-bar.section__content
    .chat-bar_menu-btn(v-if="isAdmin", @click="menuActive=true")
      i.ic-menu_light
    .chat-bar_input
      textarea(placeholder="Введите сообщение",
      rows=1, v-model="txtMsg",
      @keydown.enter.prevent="send($event)")
    .chat-bar_send-btn(@click="send($event)")
      i.ic-send

  chat-menu(v-if="isAdmin", :menu-active.sync="menuActive")

</template>

<script>
  import {
    currentLead,
    currentChatMember,
  } from 'vuex/getters';
  import {
    createChatMsg,
    setLeadStatus,
  } from "vuex/actions";

  import * as service from "services/message";
  import * as leads from "services/leads";

  import ChatMenu from './chat-menu.vue';

  export default{
    data: () => ({
      menuActive: false,
      txtMsg: "",
    }),

    vuex: {
      actions: {
        createChatMsg,
        setLeadStatus,
      },
      getters: {
        currentLead,
        currentChatMember,
      }
    },

    computed: {
      isAdmin: function() {
        if (!this.currentChatMember) {
          return false;
        }
        if (this.currentChatMember.role === leads.USER_ROLES.SUPPLIER.key
          || this.currentChatMember.role === leads.USER_ROLES.SELLER.key
          || this.currentChatMember.role === leads.USER_ROLES.SUPER_SELLER.key) {
          return true;
        }
        return false;
      },
    },

    methods: {
      send (event) {
        console.log("Enter pressed");
        event.preventDefault();
        console.log("Enter pressed 2");

        var _txtMsg = this.txtMsg.trim();
        this.txtMsg = "";
        if (!_txtMsg.length) return;

        this.createChatMsg(+this.$route.params.id, _txtMsg, "text/plain")
        .then( () => {

          this.$nextTick(this.goToBottom);

          if (this.currentLead.status === leads.STATUSES.NEW.key) {
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

    components: {
      ChatMenu
    }
  }
</script>