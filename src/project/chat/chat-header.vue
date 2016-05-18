<style src="./styles/chat-header.pcss"></style>
<template lang="jade">
div
  header-component(:notify-count='getGlobalNotifyCount', :back-link="{name: 'chat_list'}")

    .chat-header(slot="content")
      .chat-header_cnt(v-show="getShopName")
        .chat-header_cnt_t {{ getShopName }}
        .chat-header_cnt_info
          span.chat-header_cnt_info-text
          | {{ getId }},
          span  {{ getStatusName.toLowerCase() }}



      .chat-header_photo
        img(:src="getPhoto | url_thumbnail 150",
        onerror="this.error=null;this.src='/static/img/favicon.png'",)
</template>

<script type="text/babel">
  import {
    getStatusName,
    getId,
    getShopName,
    getPhoto
  } from 'vuex/getters/chat.js';
  import { getGlobalNotifyCount } from 'vuex/getters/lead.js';
  import HeaderComponent from 'base/header/header.vue';

  export default {
    vuex: {
      getters: {
        getId,
        getStatusName,
        getShopName,
        getPhoto,
        getGlobalNotifyCount
      }
    },
    components: {
      HeaderComponent,
    }
  }
</script>