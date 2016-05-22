<style src='./styles/chat-header.pcss'></style>
<template lang="jade">
div
  header-component(:notify-count='getGlobalNotifyCount', :back-link='{name: "chat_list"}')

    .chat-header(slot='content')
      .chat-header_cnt(v-show='getShopName')
        .chat-header_cnt_t {{ getShopName }}
        .chat-header_cnt_info
          span.chat-header_cnt_info-text
          | {{ getId }},
          span  {{ getStatus }}



      .chat-header_photo
        img(:src='userImage',
        v-on:error='onUserImageError',)
</template>

<script type='text/babel'>
  import {
    getStatusName,
    getId,
    getShopName,
    getPhoto
  } from 'vuex/getters/chat.js';
  import { urlThumbnail } from 'utils'
  import { getGlobalNotifyCount } from 'vuex/getters/lead.js'
  import HeaderComponent from 'base/header/header.vue'

  export default {
    data(){
      return {
        userImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      }
    },

    ready(){
      this.userImage = urlThumbnail(this.getPhoto, 150);
    },

    methods: {
       onUserImageError(e){
        console.warn(`Load user photo has failed. Chat id: ${this.getId}`);

        this.userImage = require('base/img/logo.png');
      }
    },

    vuex: {
      getters: {
        getId,
        getStatusName,
        getShopName,
        getPhoto,
        getGlobalNotifyCount
      }
    },
    computed: {
      getStatus(){
        if ( this.getStatusName !== null ) {
          return this.getStatusName.toLowerCase();
        }
      }
    },
    components: {
      HeaderComponent,
    }
  }
</script>