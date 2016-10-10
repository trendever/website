<template lang="jade">
.chat-list-i(@click="goToChat",
            track-by='id',
            v-el:chat-item)
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
  import Hammer from 'hammerjs';
  import { getTab } from 'vuex/getters/lead';

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
        getLastMessage,
        getTab
      }
    },
    ready(){

        new Hammer(this.$els.chatItem,{ touchAction: 'auto'})

        .on('swipeleft',()=>{
          this.$dispatch('closeDeleteLead');
          this.$set('showDelete', true);

        })
        .on('swiperight',()=>{

          this.$set('showDelete', false);

        });


    },
    events: {
      'closeDelete'(){
        if(this.showDelete){
          this.$set('showDelete', false)
        }
      }
    },
    methods: {
      goToChat(){

        let parentRefs = this.$parent.$parent.$refs.item;

        let item = parentRefs.find(item=>{

          return item.showDelete === true;

        })


        if(item) {

          item.showDelete = false;
          return;

        }


        if(this.showDelete) {

          this.$set('showDelete', false);
          return;

        }

        this.$router.go({name: "chat", params: {id: this.lead.id}})

      },
      deleteChat(){


          let cancel_reason = this.getTab === "customer" ? 2 : 1;


          service.setEvent(this.lead.id,'CANCEL', cancel_reason)

          .then(()=> {
            if(this.getTab === "customer") {

              let customerLeads = this.$store.state.leads.customer;
              let lead = customerLeads.filter(item=>{
                return item.id === this.lead.id;

              })
              //console.log(JSON.parse(JSON.stringify(lead)));
              let idx = customerLeads.indexOf(lead[0]);

              customerLeads.splice(idx,1);

            }

            if(this.getTab === "seller") {

              let sellerLeads = this.$store.state.leads.seller;
              let lead = sellerLeads.filter(item=>{
                return item.id === this.lead.id;

              })
              //console.log(JSON.parse(JSON.stringify(lead)));
              let idx = sellerLeads.indexOf(lead[0]);

              sellerLeads.splice(idx,1);

            }

          });

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
          return formatPastTime( this.lead.updated_at_ago );
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
