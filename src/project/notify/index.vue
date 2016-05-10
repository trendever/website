<template lang="jade">

</template>

<script type="text/babel">

  import * as messages from 'services/message';
  import { initGlobalNotify, incNotify } from 'vuex/actions/lead.js';

  export default {
    ready() {
      this.initGlobalNotify().then(() => {
        messages.onMsg( this.onMessage.bind( this ) );
      });
    },
    beforeDestroy(){
      messages.offMsg( this.onMessage.bind( this ) );
    },
    methods: {
      onMessage( { response_map: { chat } } )  {
        this.incNotify( chat.id );
      },
    },
    vuex: {
      actions: {
        incNotify,
        initGlobalNotify,
      }
    },
  }
</script>
