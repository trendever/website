<style src='./styles/chat-header.pcss'></style>
<template lang="jade">
div
  header-component(:notify-count='getGlobalNotifyCount')

    .chat-header(slot='content')
      .chat-header_arrow(@click='leftBtnAction')
        i.chat-header_arrow_ic.ic-arrow-left

      .chat-header_notify-count(v-if='getGlobalNotifyCount')
        span {{ getGlobalNotifyCount }}

      .chat-header_cnt(v-show='getShopName')
        .chat-header_cnt_t(v-link='{name: "user", params: {id: getShopName}}') {{ getShopName }}
        .chat-header_cnt_info
          span.chat-header_cnt_info-text
          | {{ getLeadId }},
          span  {{ getStatus }}

      .chat-header_photo
        img(
        v-link='{name: "user", params: {id: getShopName}}',
        :src='userImage',
        v-on:error='onUserImageError',)
</template>

<script type='text/babel'>

  import { urlThumbnail } from 'utils'

  import {
    getStatusName,
    getId,
    getLeadId,
    getShopName,
    getPhoto
  } from 'vuex/getters/chat.js';

  import { getGlobalNotifyCount } from 'vuex/getters/lead.js'

  import {isFake} from 'vuex/getters/user.js'

  import HeaderComponent from 'base/header/header.vue'

  export default {
    data(){
      return {
        userImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      }
    },
    methods: {
       onUserImageError(){
        console.warn(`Load user photo has failed. Chat id: ${this.getId}`);
         this.$set('userImage', require('base/img/logo.png'));
      },
      leftBtnAction(){
        if (this.isFake){
          if (this.$route.name === window.before.name && window.before.prev){
            this.$router.go({ name: window.before.prev.name, params: window.before.prev.params})
            return;
          }
          this.$router.go({ name: window.before.name, params: window.before.params})
        }else{
          this.$router.go({name: "chat_list"})
        }
      }
    },

    vuex: {
      getters: {
        getId,
        getLeadId,
        getStatusName,
        getShopName,
        getPhoto,
        isFake,
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
    },
    watch:{
      getPhoto(val){
        this.$set('userImage', val);
      }
    }
  }
</script>
