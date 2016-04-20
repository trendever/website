<template lang="jade">

</template>

<script>
  import {
    receiveChatNotify,
  } from 'vuex/actions';
  import store from 'vuex/store';
  import * as types from 'vuex/mutation-types';
  import * as messages from 'services/message';

  export default {
    data: () => ({
    }),

    vuex: {
      actions: {
        receiveChatNotify
      }
    },

    ready() {
      var self = this;
      // Listen server direct notify globally
      messages.onMsg(function(r){
        self.receiveChatNotify(receiveChatNotify);
        store.dispatch(types.RECEIVE_CHAT_MSG,
        r.response_map.chat.id, r.response_map.messages[0]);
      })
    },

  }
</script>
