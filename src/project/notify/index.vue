<template lang="jade">

</template>

<script type='text/babel'>

  import * as messages from 'services/message';
  import { initGlobalNotify, incNotify } from 'vuex/actions/lead.js';
  import { isAuth } from 'vuex/getters';

  export default {
    ready() {
      if (this.isAuth) {
        this.initGlobalNotify().then(() => {
          messages.onMsg( this.onMessage.bind( this ) );
        });
      }
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
      },
      getters: {
        isAuth,
      }
    },
  }
</script>
