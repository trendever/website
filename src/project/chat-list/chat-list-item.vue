<template lang="jade">
.chat-list_i(v-link="{name: 'chat', params: {id: lead.id}}", track-by="id")

  .chat-list_i_photo
    img(:src="lead.products && lead.products[0].instagram_image_url")
  .chat-list_i_body
    .body_t {{ getTitle() }}
    .body_status ({{ getStatus() | lowercase }})
    .body_last-msg
      | {{ getRecentMessage() }}
  .chat-list_i_date {{ getDatetime() }}
  .chat-list_i_notify(v-if="lead.chat.unread_count")
    span {{ lead.chat.unread_count }}

</template>

<script type="text/babel">
  import { formatDatetime } from 'project/chat/utils';
  import * as service from 'services/leads';

  export default {
    data: () => ({
      title: null,
    }),

    props: {
      lead: {
        type: Object,
        required: true
      }
    },

    methods: {
      getStatus: function() {
        return service.getStatus(this.lead.status).name
      },
      getTitle: function() {
        if (this.lead.user_role === service.USER_ROLES.CUSTOMER.key
            || this.lead.user_role === service.USER_ROLES.SUPPLIER.key) {
          return this.lead.shop.instagram_username
        }
        return `${this.lead.customer.instagram_username} (${this.lead.shop.instagram_username})`
      },
      getRecentMessage: function() {
        let msg = this.lead.chat.recent_message;
        if (msg.parts[0].mime_type === 'text/plain') {
          return msg.parts[0].content;
        }
        if (msg.parts[0].mime_type === 'text/json') {
          let product = JSON.parse(msg.parts[0].content);
          return `товар: ${product.Title}`;
        }
      },
      getDatetime: function() {
        return formatDatetime(this.lead.chat.recent_message.created_at);
      },

    },

  }
</script>