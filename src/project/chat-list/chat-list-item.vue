<template lang="jade">
.chat-list_i(v-link="{name: 'chat', params: {id: lead.id}}", track-by="id")

  .chat-list_i_photo
    img(:src="lead.products && lead.products[0].instagram_image_url")
  .chat-list_i_body
    .body_t {{ title }}
    .body_status ({{ status | lowercase }})
    .body_last-msg
      | {{ recentMessage }}
  .chat-list_i_date {{ dataTime }}
  .chat-list_i_notify(v-if="unreadCount")
    span {{ unreadCount }}

</template>

<script type="text/babel">
  import { formatDatetime } from 'project/chat/utils';
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
          return formatDatetime(this.lead.chat.recent_message.created_at);
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