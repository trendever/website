<style src="./styles/chat-msg-photo-txt.pcss"></style>
<template lang="jade">

.chat-row(:class="getSide()")
  .bubble
    a.chat-msg-photo-txt(target="_blank",
     v-link="{name: 'product_detail', params: {id: product.ID}}")
      .chat-msg-photo-txt_photo
        img(:src="product.InstagramImageURL")

      .chat-msg-photo-txt_txt
        |{{ description }}

      .bubble_info
        .bubble_info_time {{ datetime }}
        //.bubble_info_status
          i.ic-check-double

</template>

<script>
import {
    currentChatMember
  } from 'vuex/getters';

  import { formatDatetime } from './utils';

  export default{
    data: () => ({
    }),

    props: {
      msg: {
        type: Object,
        required: true
      }
    },

    computed: {
      product() {
        return JSON.parse(this.msg.parts[0].content);
      },
      description() {
        return this.product.Items.reduce(function(desc, item, i, arr) {
          desc += `${item.Name} `
          if (item.DiscountPrice) {
            desc += `${item.DiscountPrice} ₽`
          } else if (item.Price) {
            desc += `${item.Price} ₽`
          } else {
            desc += `цена по запросу`
          }

          if (i < arr.length -1) {
            desc += ', '
          }

          return desc
        }, '')
      },
      datetime () {
        return formatDatetime(this.msg.created_at);
      }
    },

    methods: {
      getSide(){
        if (!this.msg.user || !this.currentMember) {
          return '__center';
        }
        if (this.currentMember.user_id === this.msg.user.user_id) {
          return '__right';
        } else {
          return '__left';
        }
      },
    },

    vuex: {
      getters: {
        currentMember: currentChatMember
      }
    },

  }
</script>