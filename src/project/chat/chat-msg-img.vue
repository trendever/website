<style src='./styles/chat-msg-img.pcss'></style>
<template lang="jade">

.chat-row(:class='getSide')
  span(class='bubble_info bubble_info_time') {{ datetime }}
  .bubble_info.bubble_info_status(v-if='isOwnMessage')
    i(:class='{"ic-check": isSent, "ic-check-double": isRead}')
  a.chat-msg.bubble(
    :href='getImg',
    target='_blank',
    :class='{"chat-msg-closest":isClosest, "chat-msg-not-closest":!isClosest}')
    .chat-msg_t(v-if='!isOwnMessage && !isClosest')
      | {{{ getUsername }}}
    img(:src='getImg', class='chat-msg-img', v-bind:class='{"chat-msg-img-opacity":!isLoaded }', v-bind:style="imgStyle")

</template>

<script type='text/babel'>
  import { getCurrentMember, getShopName, getLastMessageId } from 'vuex/getters/chat.js';
  import * as service from 'services/chat';
  import * as leads from 'services/leads';
  import { formatTime } from './utils';
  import { ratioFit } from 'utils';

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
      }
    },

    data(){
      return {
        imgStyle:{
          maxWidth: `600px`,
          maxHeight: `400px`
        }
      }
    },

    computed: {
      isLoaded(){
        if( 'loaded' in this.msg){
          return this.msg.loaded;
        }
        return true;
      },
      getImg(){
        const cnt = this.msg.parts[ 0 ].content;

        if ( this.msg.parts[ 0 ].mime_type === 'image/json' ) {

          let img = JSON.parse( cnt );
          const maxWidth = (window.matchMedia("(max-width:750px)").matches)? 570 : 600;
          const {width, height} = ratioFit(img.width, img.height, maxWidth, img.height);

          this.$set('imgStyle.width', `${width}px`);
          this.$set('imgStyle.height', `${height}px`);

          if (img.thumbs.big) {
            return img.thumbs.big;
          }
          return img.link;
        }

        if ( typeof cnt === 'string' ) {

          return `data:${this.msg.parts[ 0 ].mime_type};base64,${cnt}`;

        }

        if ( cnt.thumbs && cnt.thumbs.big ) {

          return cnt.thumbs.big

        }

        if ( 'link' in cnt ) {

          this.$set('imgStyle.width', `${cnt.width}px`);
          this.$set('imgStyle.height', `${cnt.height}px`);

          return cnt.link;

        }

      },
      datetime() {
        return formatTime(this.msg.created_at);
      },
      getUsername () {
        if (this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key) {
          return `<b>${this.getShopName}</b>`
        }
        return `<b>${this.getShopName}</b> <br/> (продавец ${this.msg.user.name})`
      },
      isClosest(){
        return this.msg.closestMessage;
      },
      isOwnMessage() {
        return this.getCurrentMember.user_id === this.msg.user.user_id
      },
      isSent() {
        return !this.isRead
      },
      isRead() {
        return this.getLastMessageId >= this.msg.id
      },
      getSide() {
        return this.isOwnMessage ? '__right' : '__left';
      },
    },

  }
</script>
