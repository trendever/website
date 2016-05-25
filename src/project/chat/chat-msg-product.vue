<style src="./styles/chat-msg-product.pcss"></style>
<template lang="jade">

.chat-row(:class='getSide')
  .bubble_info.bubble_info_time {{ datetime }}
  .bubble_info.bubble_info_status(v-if='isOwnMessage')
    i(:class='{"ic-check": isSent, "ic-check-double": isRead}')
  .bubble
    .chat-msg-product-wrap
      a.chat-msg-product(v-link="{name: 'product_detail', params: {id: product.ID}}")
        .chat-msg-product-photo
          img(:src="photo")
      .chat-msg-description
        .chat-msg_t(v-if='!isOwnMessage')
          | {{{ getUsername }}}
        .chat-msg-product(v-link='{name: "product_detail", params: {id: product.ID}}')
          .chat-msg-product-txt
            a(v-link='{name: "product_detail", params: {id: product.ID}}')
              |{{{ titles }}}
            br
            span
              |{{{ description }}}
</template>

<script type='text/babel'>
  import { formatDatetime, urlThumbnail } from 'utils';
  import { formatTime } from './utils';
  import * as leads from 'services/leads';
  import { getCurrentMember, getLastMessageId, getShopName } from 'vuex/getters/chat.js';
  export default{
    props: {
      msg: {
        type: Object,
        required: true
      }
    },
    vuex:{
      getters:{
        getShopName,
        getCurrentMember,
        getLastMessageId,
      }
    },
    computed: {
      getUsername () {
        if (this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key) {
          return `<b>${this.getShopName}</b>`
        }
        return `<b>${this.getShopName}</b> <br/> (продавец ${this.msg.user.name})`
      },
      datetime () {
        return formatTime(this.msg.created_at);
      },
      product() {
        return JSON.parse(this.msg.parts[0].content);
      },
      photo() {
        const {InstagramImageURL, InstagramImageHeight, InstagramImageWidth} = this.product;
        return urlThumbnail(InstagramImageURL, 306, InstagramImageWidth, InstagramImageHeight)
      },
      description(){
        return this.product.InstagramImageCaption;
      },
      titles() {
        return this.product.Items.reduce(function(desc, item, i, arr) {
          desc += `${item.Name} `;
          if (item.DiscountPrice) {
            desc += `, ${item.DiscountPrice} <i class="ic-currency-rub"</i>`;
          } else if (item.Price) {
            desc += `, ${item.Price} <i class="ic-currency-rub"</i>`;
          } else {
            desc += `, цена по запросу`;
          }
          return desc;
        }, '')
      },
      isOwnMessage() {
        return this.getCurrentMember.user_id === this.msg.user.user_id;
      },
      isSent() {
        return !this.isRead;
      },
      isRead() {
        return this.getLastMessageId >= this.msg.id;
      },
      getSide() {
        if(!this.msg.user || !this.getCurrentMember) {
          return '__center';
        }
        return this.isOwnMessage ? '__right' : '__left';
      },
    },
  }
</script>
