<style src="./styles/chat-header.pcss"></style>
<template lang="jade">
div
  header-component(:notify-count='conversationNotifyCount',
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
  import { conversationNotifyCount, getLead } from 'vuex/getters/chatGetters.js';

  import * as leads from 'services/leads';
  import HeaderComponent from 'base/header/header.vue';

  export default{
    data: () => ({
    }),

    vuex: {
      getters: {
        conversationNotifyCount,
        getLead,
      }
    },

    computed: {
      id() {
        if (this.getLead) {
          return this.getLead.id
        }
      },
      shopName() {
        if (this.getLead) {
          return this.getLead.shop.instagram_username;
        }
      },
      shopPhoto() {
        if (this.getLead) {
          return this.getLead.shop.instagram_avatar_url;
        }
      },
      status() {
        if (this.getLead) {
          return leads.getStatus(this.getLead.status).name;
        }
      },
    },

    components: {
      HeaderComponent,
    }
  }
</script>