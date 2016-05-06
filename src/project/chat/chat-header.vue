<style src="./styles/chat-header.pcss"></style>
<template lang="jade">
div
  header-component(:notify-count='conversationNotifyCount',
  :back-link="{name: 'chat_list'}")

    .chat-header(slot="content")
      .chat-header_cnt(v-show="getConversationName")
        .chat-header_cnt_t {{ getConversationName }}
        .chat-header_cnt_info
          span #
          | {{ getConversationId }},
          span  {{ getStatusName }}



      .chat-header_photo
        img(:src="getConversationPhoto | url_thumbnail 150",
        onerror="this.error=null;this.src='/static/img/favicon.png'",)
</template>

<script type="text/babel">
  import {
    conversationNotifyCount,
    getStatusName,
    getConversationId,
    getConversationName,
    getConversationPhoto
  } from 'vuex/getters/chatGetters.js';

  import HeaderComponent from 'base/header/header.vue';

  export default {
    vuex: {
      getters: {
        conversationNotifyCount,
        getConversationId,
        getStatusName,
        getConversationName,
        getConversationPhoto
      }
    },
    components: {
      HeaderComponent,
    }
  }
</script>