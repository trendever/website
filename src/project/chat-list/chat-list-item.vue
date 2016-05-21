<template lang="jade">
.chat-list_i(v-link="{name: 'chat', params: {id: lead.id}}", track-by="id")
  .chat-list_i_photo
    img(:src="getPhoto(lead.products[0])")
  .chat-list_i_body
    .body_t {{ title }}
    .body_status ({{ status | lowercase }})
    .body_last-msg
      | {{{ recentMessage }}}
  .chat-list_i_info
    .chat-list_i_info_date {{ dataTime }}
    .chat-list_i_info_notify(v-if="unreadCount")
      span {{ unreadCount }}
</template>

<script type="text/babel">
  import { urlThumbnail } from 'utils'
  import { formatPastTime } from 'project/chat/utils';
  import * as service from 'services/leads';
  import { getNotifyCountList, getLastMessage } from 'vuex/getters/lead.js';

  export default {
    data(){
      return {
        title: null,
      };
    },
    props: {
      lead: {
        type: Object,
        required: true
      }
    },
    vuex: {
      getters: {
        getNotifyCountList,
        getLastMessage
      }
    },
    methods: {
      getPhoto(obj) {
        if (this.lead.products) {
          return urlThumbnail(obj.instagram_image_url, 306, obj.instagram_image_width, obj.instagram_image_height)
        }
      }
    },
    computed: {
      unreadCount(){
        return this.getNotifyCountList[ this.lead.id ];
      },
      recentMessage(){

        return this.getLastMessage[ this.lead.id ];
      },
      status(){
        return service.getStatus(this.lead.status).name
      },
      dataTime(){
        if(this.lead.chat !== null){
          return formatPastTime(this.lead.updated_at / 1e9);
        }
      },
      title(){
        if(this.lead.chat !== null){
          if (this.lead.user_role === service.USER_ROLES.CUSTOMER.key
                  || this.lead.user_role === service.USER_ROLES.SUPPLIER.key) {
            return this.lead.shop.instagram_username
          }
          return `${this.lead.chat.members.find(({user_id}) => this.lead.customer_id === user_id).name} (${this.lead.shop.instagram_username})`
        }
      }
    },
  }
</script>