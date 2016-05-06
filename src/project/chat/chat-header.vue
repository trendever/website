<style src="./styles/chat-header.pcss"></style>
<template lang="jade">
div
  header-component(:notify-count='conversationNotifyCount',
  :back-link="{name: 'chat_list'}")

    .chat-header(slot="content")
      .chat-header_cnt(v-show="getShopName")
        .chat-header_cnt_t {{ getShopName }}
        .chat-header_cnt_info
          span #
          | {{ getId }},
          span  {{ getStatusName }}



      .chat-header_photo
        img(:src="getPhoto | url_thumbnail 150",
        onerror="this.error=null;this.src='/static/img/favicon.png'",)
</template>

<script type="text/babel">
  import {
    conversationNotifyCount,
    getStatusName,
    getId,
    getShopName,
    getPhoto
  } from 'vuex/getters/chatGetters.js';

  import HeaderComponent from 'base/header/header.vue';

  export default {
    vuex: {
      getters: {
        conversationNotifyCount,
        getId,
        getStatusName,
        getShopName,
        getPhoto
      }
    },
    components: {
      HeaderComponent,
    }
  }
</script>