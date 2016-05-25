<template lang="jade">

</template>

<script type='text/babel'>

  import * as messages from 'services/message';
  import * as leads from 'services/leads';
  import * as lead from 'vuex/actions/lead.js';
  import * as chat from 'vuex/actions/chat.js';
  import { isAuth } from 'vuex/getters';

  export default {
    ready() {
      this.onMessage      = this.onMessage.bind( this );
      this.onMessageRead  = this.onMessageRead.bind( this );
      this.onChangeStatus = this.onChangeStatus.bind( this );
      this.on             = this.on.bind( this );
      this.off            = this.off.bind( this );
      if ( this.isAuth ) {
        this.on();
      }
    },
    beforeDestroy(){
      this.off();
    },
    methods: {
      onMessage( data ) {
        this.onMessagesLead( data );
        this.onMessagesChat( data );
      },
      onMessageRead( data ) {
        this.onMessageReadLead( data );
        this.onMessageReadChat( data );
      },
      onChangeStatus( data ) {
        this.onStatusLead( data );
        this.onStatusChat( data );
      },
      on() {
        this.init().then( () => {
          messages.onMsg( this.onMessage );
          messages.onMsgRead( this.onMessageRead );
          leads.onChangeStatus( this.onChangeStatus );
        } );
      },
      off() {
        messages.offMsg( this.onMessage );
        messages.offMsgRead( this.onMessageRead );
        leads.removeStatusListener( this.onChangeStatus );
      }
    },
    watch: {
      isAuth( isAuth ){
        isAuth ? this.on() : this.off();
      }
    },
    vuex: {
      actions: {
        init: lead.init,
        onStatusLead: lead.onStatus,
        onMessagesLead: lead.onMessages,
        onMessageReadLead: lead.onMessageRead,
        onStatusChat: chat.onStatus,
        onMessagesChat: chat.onMessages,
        onMessageReadChat: chat.onMessageRead,
      },
      getters: {
        isAuth,
      }
    },
  }
</script>
