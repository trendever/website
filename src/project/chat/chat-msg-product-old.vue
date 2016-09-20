<style src="./styles/chat-msg-product.pcss"></style>
<template lang="jade">

.chat-row(:class='getSide')
  .bubble_info.bubble_info_time {{ datetime }}
  .bubble_info.bubble_info_status(v-if='isOwnMessage')
    i(:class='{"ic-check": isSent, "ic-check-double": isRead}')
  .bubble(:class='{"chat-msg-closest":isClosest, "chat-msg-not-closest":!isClosest && !isAfterServiceMessage}')
    .chat-msg-product-wrap
      a.chat-msg-product(v-link="{name: 'product_detail', params: {id: product.id}}")
        .chat-msg-product-photo
          img(:src="photo")
      .chat-msg-description
        .chat-msg_t(
            v-link='{name: "user", params: {id: getUserNameLink}}',
            v-if='!isOwnMessage && !isClosest',
            :class='{"chat-msg_t-customer-color":isCustomer}'
          )
            | {{{ getUsername }}}
        .chat-msg-product(
            v-link='{name: "product_detail", params: {id: product.id}}'
          )
          .chat-msg-product-txt(:class="{'-closest':isClosest}")
            a(v-link='{name: "product_detail", params: {id: product.id}}')
              |{{{ titles }}}
            br(v-if="titles")
            span
              |{{{ description }}}
</template>

<script type='text/babel'>
  import { formatDatetime } from 'utils';
  import { formatTime } from './utils';
  import { user } from 'vuex/getters/user.js';
  import * as leads from 'services/leads';
  import { getCurrentMember, getLastMessageId, getShopName } from 'vuex/getters/chat.js';
  export default{
    props: {
      msg: {
        type: Object,
        required: true
      }
    },
    vuex: {
      getters: {
        getShopName,
        getCurrentMember,
        getLastMessageId,
        user
      }
    },
    computed: {
      getUsername() {
        if ( this.isCustomer ) {
          return `<b>${this.msg.user.name}</b>`
        }
        if ( this.msg.user.role === leads.USER_ROLES.SUPPLIER.key ) {
          return `<b>${this.getShopName}</b>`
        }
        if ( this.getCurrentMember !== null ) {
          if ( this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key ) {
            return `<b>${this.getShopName}</b>`
          }
        }
        return `<b>${this.getShopName}</b> (${this.msg.user.name})`
      },
      isAfterServiceMessage(){
        return !!this.msg.afterServiceMessage;
      },
      isCustomer(){
        return this.msg.user.role === leads.USER_ROLES.CUSTOMER.key;
      },
      datetime () {
        return formatTime( this.msg.created_at );
      },
      product() {
        return JSON.parse( this.msg.parts[ 0 ].content );
      },
      photo() {
        if ( Array.isArray( this.product.instagram_images ) ) {
          return this.product.instagram_images.find( ( img ) => img.name == "S_square" ).url
        }
      },
      getUserNameLink() {
        if ( this.isCustomer ) {
          return this.msg.user.name;
        }
        return this.getShopName;
      },
      description(){
        return this.product.instagram_image_caption;
      },
      titles() {
        if ( Array.isArray( this.product.items ) ) {
          return this.product.items.reduce( function( desc, item, i, arr ) {
            if ( item.name ) {
              desc += `${item.name} `;
            }
            if ( item.discount_price ) {
              desc += `, ${item.discount_price} <i class="ic-currency-rub"></i> `;
            } else if ( item.price ) {
              desc += `, ${item.price} <i class="ic-currency-rub"></i> `;
            } else {
              desc += `, цена по запросу `;
            }
            return desc;
          }, '' )
        }
        return '';
      },
      isClosest(){
        return this.msg.closestMessage;
      },
      isOwnMessage() {
        if ( this.getCurrentMember !== null ) {
          return this.getCurrentMember.user_id === this.msg.user.user_id;
        }
        return false;
      },
      isSent() {
        return !this.isRead;
      },
      isRead() {
        return this.getLastMessageId >= this.msg.id;
      },
      getSide() {
        if ( !this.msg.user || !this.getCurrentMember ) {
          return '__center';
        }
        return this.isOwnMessage ? '__right' : '__left';
      },
    },
  }
</script>