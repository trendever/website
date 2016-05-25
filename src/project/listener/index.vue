<template lang="jade">

</template>

<script type='text/babel'>

  import * as messages from 'services/message';
  import * as leads from 'services/leads';
  import { init } from 'vuex/actions/lead.js';
  import * as actionsChat from 'vuex/actions/chat.js';
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
      onMessage( { response_map } ) {

      },
      onMessageRead( { response_map } ) {

      },
      onChangeStatus( { response_map } ) {

      },
      on() {
        this.init().then(() => {
          messages.onMsg( this.onMessage );
          messages.onMsgRead( this.onMessageRead );
          leads.onChangeStatus( this.onChangeStatus );
        });
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
        init,
      },
      getters: {
        isAuth,
      }
    },
  }
</script>
