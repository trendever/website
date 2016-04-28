<style src="./styles/chat-header.pcss"></style>
<template lang="jade">
div
  header-component(:notify-count='chatNotifyCount',
  :back-link="{name: 'chat_list'}")

    .chat-header(slot="content")
      .chat-header_cnt(v-show="shopName")
        .chat-header_cnt_t {{ shopName }}
        .chat-header_cnt_info
          span #
          | {{ id }},
          span  {{ status }}



      .chat-header_photo
        img(:src="shopPhoto | url_thumbnail 150",
        onerror="this.error=null;this.src='/static/img/favicon.png'",)
</template>

<script type="text/babel">
import {
    chatNotifyCount,
    currentChatMember,
    currentLead,
  } from 'vuex/getters';

  import * as leads from 'services/leads';
  import HeaderComponent from 'base/header/header.vue';

  export default{
    data: () => ({
    }),

    vuex: {
      getters: {
        chatNotifyCount,
        currentLead,
      }
    },

    computed: {
      id() {
        if (this.currentLead) {
          return this.currentLead.id
        }
      },
      shopName() {
        if (this.currentLead) {
          return this.currentLead.shop.instagram_username;
        }
      },
      shopPhoto() {
        if (this.currentLead) {
          return this.currentLead.shop.instagram_avatar_url;
        }
      },
      status() {
        if (this.currentLead) {
          return leads.getStatus(this.currentLead.status).name;
        }
      },
    },

    components: {
      HeaderComponent,
    }
  }
</script>