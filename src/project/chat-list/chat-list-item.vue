<template lang="jade">
.chat-list-i(v-link='{name: "chat", params: {id: lead.id}}',
            track-by='id')
  .chat-list-i-photo(v-if="!showDelete")
    img(:src='getPhoto()')

  .chat-list-i-body

    .body-title {{ title }}

    .body-status-time
      .body-status ({{ status | lowercase }})
      .body-time {{ dataTime }}

    .body-last-msg
      p
        b(v-if="recentMessage.user_name.length > 0") {{recentMessage.user_name}}:
        | {{{ recentMessage.message }}}
      .body-notify(v-if='unreadCount')
        span {{ unreadCount }}
  .chat-list-i-delete(:class="{'open-delete': showDelete}", @click.stop="deleteChat") Удалить

</template>

<script type='text/babel'>
  import { urlThumbnail } from 'utils'
  import { formatPastTime } from 'project/chat/utils';
  import * as service from 'services/leads';
  import { getNotifyCountList, getLastMessage } from 'vuex/getters/lead.js';

  /*
  /*Swipe
  */

  var touchStartCoords =  {'x':-1, 'y':-1}, // X and Y coordinates on mousedown or touchstart events.
    touchEndCoords = {'x':-1, 'y':-1},// X and Y coordinates on mouseup or touchend events.
    direction = 'undefined',// Swipe direction
    minDistanceXAxis = 30,// Min distance on mousemove or touchmove on the X axis
    maxDistanceYAxis = 30,// Max distance on mousemove or touchmove on the Y axis
    maxAllowedTime = 1000,// Max allowed time between swipeStart and swipeEnd
    startTime = 0,// Time on swipeStart
    elapsedTime = 0;// Elapsed time between swipeStart and swipeEnd

  export default {
    data(){
      return {
        title: null,
        showDelete: false
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
      swipeStart(e){
        e = e ? e : window.event;
        e = ('changedTouches' in e)?e.changedTouches[0] : e;
        touchStartCoords = {'x':e.pageX, 'y':e.pageY};
        startTime = new Date().getTime();
      },
      swipeEnd(e){
        e = e ? e : window.event;
        e = ('changedTouches' in e)?e.changedTouches[0] : e;
        touchEndCoords = {'x':e.pageX - touchStartCoords.x, 'y':e.pageY - touchStartCoords.y};
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= maxAllowedTime){
          if (Math.abs(touchEndCoords.x) >= minDistanceXAxis && Math.abs(touchEndCoords.y) <= maxDistanceYAxis){
            direction = (touchEndCoords.x < 0) ? 'left' : 'right';
            switch(direction){
              case 'left':
                this.showDelete = true;
                break;
              case 'right':
                this.showDelete = false;
                break;
            }
          }
        }
      },
      deleteChat(){
        alert(1);
        return;

        service.deleteChat();

      },
      getPhoto() {

        if ( Array.isArray( this.lead.products ) ) {

          if ( this.lead.products.length > 0 ) {

            const { instagram_images } = this.lead.products[ 0 ];

            if ( Array.isArray( instagram_images ) ) {

              const result = instagram_images.find( ( img ) => img.name == "S_square" ).url;

              if ( typeof result === 'undefined' ) {

                return null;

              }

              return result;

            }

          }

        }

        return null;

      }
    },
    computed: {
      unreadCount(){
        return this.getNotifyCountList[ this.lead.id ];
      },
      recentMessage(){
        const msgObj = this.getLastMessage[ this.lead.id ];
        if ( msgObj ) {
          msgObj.message = msgObj.message.replace(/₽/g, '&nbsp;<i class="ic-currency-rub"></i> ');
          return msgObj;
        }
        return {
          message: '',
          user_name: '',
        }
      },
      status(){
        return service.getStatus( this.lead.status ).name
      },
      dataTime(){
        if ( this.lead.chat !== null ) {
          return formatPastTime( this.lead.updated_at / 1e9 );
        }
      },
      title(){
        if ( this.lead.chat !== null ) {
          if ( this.lead.user_role === service.USER_ROLES.CUSTOMER.key
            || this.lead.user_role === service.USER_ROLES.SUPPLIER.key ) {
            return this.lead.shop.instagram_username
          }
          return `${this.lead.chat.members.find( ( { user_id } ) => this.lead.customer_id === user_id ).name} (${this.lead.shop.instagram_username})`
        }
      }
    },
  }
</script>
