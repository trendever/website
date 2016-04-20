<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">

div
  .chat-bar.section__content
    .chat-bar_menu-btn(@click="menuActive=true")
      i.ic-menu_light
    .chat-bar_input
      textarea(placeholder="Введите сообщение",
      rows=1, v-model="txtMsg",
      @keydown.enter.prevent="send($event)")
    .chat-bar_send-btn(@click="send()")
      i.ic-send

  chat-menu(:menu-active.sync="menuActive")

</template>

<script>
  import {
    createChatMsg,
  } from "vuex/actions";

  import * as service from "services/message";

  import ChatMenu from './chat-menu.vue';

  export default{
    data: () => ({
      menuActive: false,
      txtMsg: "",
    }),

    vuex: {
      actions: {
        createChatMsg
      }
    },

    methods: {
      send (event) {
        event.preventDefault();

        var _txtMsg = this.txtMsg.trim();
        this.txtMsg = "";
        if (!_txtMsg.length) return;

        this.createChatMsg(+this.$route.params.id, _txtMsg, "text/plain").then( () => {
           this.$nextTick(this.goToBottom);
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