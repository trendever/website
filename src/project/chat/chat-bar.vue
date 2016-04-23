<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  .chat-bar.section__content
    .chat-bar_menu-btn(v-if="isAdmin", @click="menuActive=true")
      i.ic-menu_light
    .chat-bar_input
      textarea(placeholder="Введите сообщение",
      rows=1, v-model="txtMsg", v-el:input-msg
      @keydown.enter.prevent="send($event)",
      v-on:touchstart="inputTouchStart()",
      v-on:blur="inputBlur()")
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
      saveScrollPos: 0,
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
      inputTouchStart(){
        this.saveScrollPos = window.body.scrollTop;
        window.body.style.position = 'relative';
        window.body.style.top = -window.body.scrollTop;
        document.getElementsByTagName("html")[0].style.overflow = 'hidden';
      },
      inputBlur(){
        window.body.style.position = 'auto';
        window.body.style.top = 'auto';
        document.getElementsByTagName("html")[0].style.overflow = 'auto';
      },

      send (event) {
        event.preventDefault();
        this.$els.inputMsg.focus();

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