<style src="./styles/chat-msg-product.pcss"></style>
<template lang="jade">

.chat-row(:class='getSide')
  .bubble_info.bubble_info_time {{ datetime }}
  .bubble_info.bubble_info_status(v-if='isOwnMessage')
    i(:class='{"ic-check": isSent, "ic-check-double": isRead}')
  .bubble(:class='{"chat-msg-not-closest":!isClosest && !isAfterServiceMessage}')
    .chat-msg-product-wrap
      a.chat-msg-product(v-link="{name: 'product_detail', params: {id: product.id}}")
        .chat-msg-product-photo
          img(:src="product.image")
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
            |{{{ getMessage }}}
</template>

<script type='text/babel'>
  import { formatTime, formatDatetime, escapeHtml, wrapLink } from './utils';
  import { user } from 'vuex/getters/user.js';
  import * as leads from 'services/leads';
  import { getCurrentMember, getLastMessageId, getCustomerName, getCustomerId, getShopName } from 'vuex/getters/chat.js';
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
        getCustomerId,
        getCustomerName,
        getLastMessageId,
        user
      }
    },
    computed: {
      getUsername() {
        if (this.getCustomerName.indexOf("customer_") >= 0){
          return `<b>${this.getCustomerName.replace("customer_","client")}</b>`
        }
        return `<b>${this.getCustomerName}</b>`
      },
      isAfterServiceMessage(){
        return !!this.msg.afterServiceMessage;
      },
      isCustomer(){
        //так как приходит роль 5 а по заданию нужна ссылка на профиль кастомера
        return true;
        //return this.msg.user.role === leads.USER_ROLES.CUSTOMER.key;
      },
      datetime () {
        return formatTime( this.msg.created_at );
      },
      getMessage() {
        return wrapLink(this.msg.parts[0].content);
      },
      product() {
        let data = this.msg.parts[1].content.split("~");
        return {image: data[0], id: +data[1]};
      },
      photo() {
        if ( Array.isArray( this.product.instagram_images ) ) {
          return this.product.instagram_images.find( ( img ) => img.name == "S_square" ).url
        }
      },
      getUserNameLink() {
        return this.getCustomerName;
        if ( this.isCustomer ) {
          return this.msg.user.name;
        }
        //return this.getShopName;
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
        return false;
      },
      isOwnMessage() {
        if (this.getCustomerId === this.$store.state.user.myId){
          return true;
        }else{
          return false;
        }
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
