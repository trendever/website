<style src="./styles/chat-msg-photo-txt.pcss"></style>
<template lang="jade">

.chat-row(:class="getSide")
  .bubble
    a.chat-msg-photo-txt(v-link="{name: 'product_detail', params: {id: product.ID}}")
      .chat-msg-photo-txt_photo
        img(:src="product.InstagramImageURL")

      .chat-msg-photo-txt_txt
        |{{{ description }}}

      .bubble_info
        .bubble_info_time {{ datetime }}
        .bubble_info_status(v-if="isOwnMessage")
          i(:class="{'ic-check': isSent, 'ic-check-double': isRead}")

</template>

<script type="text/babel">
  import { formatDatetime } from './utils';
  import { getCurrentMember } from 'vuex/getters/chatGetters.js';
  export default{
    props: {
      msg: {
        type: Object,
        required: true
      },
      lastReadMessageId: Number
    },
    vuex:{
      getters:{
        getCurrentMember
      }
    },
    computed: {
      product() {
        return JSON.parse(this.msg.parts[0].content);
      },

      description() {
        return this.product.Items.reduce(function(desc, item, i, arr) {
          desc += `${item.Name} `;

          if (item.discountPrice) {
            desc += `${item.discountPrice} <i class="ic-currency-rub"</i>`
          } else if (item.price) {
            desc += `${item.price} <i class="ic-currency-rub"</i>`
          } else {
            desc += `цена по запросу`
          }

          if (i < arr.length -1) {
            desc += ', '
          }

          return desc
        }, '')
      },

      isOwnMessage() {
        return this.getCurrentMember.user_id === this.msg.user.user_id
      },

      isSent() {
        return !this.isRead
      },

      isRead() {
        return this.lastReadMessageId >= this.msg.id
      },

      getSide(){
        if(!this.msg.user || !this.getCurrentMember) {
          return '__center';
        }

        return this.isOwnMessage ? '__right' : '__left';
      },
    },
  }
</script>