<template lang="jade">

</template>

<script type='text/babel'>

  import * as messages from 'services/message';
  import * as leads from 'services/leads';
  import * as lead from 'vuex/actions/lead.js';
  import * as chat from 'vuex/actions/chat.js';
  import { isAuth } from 'vuex/getters/user.js';

  export default {
    ready() {
      this.onMessage      = this.onMessage.bind( this );
      this.onMessageRead  = this.onMessageRead.bind( this );
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
      },
      on() {

        this.init().then( () => {
          messages.onMsg( this.onMessage );
          messages.onMsgRead( this.onMessageRead );
        } );
      },
      off() {
        messages.offMsg( this.onMessage );
        messages.offMsgRead( this.onMessageRead );
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
        onMessagesLead: lead.onMessages,
        onMessagesChat: chat.onMessages,
        onMessageReadLead: lead.onMessageRead,
      },
      getters: {
        isAuth,
      }
    },
  }
</script>
