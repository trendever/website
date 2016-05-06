<template lang="jade">

</template>

<script type="text/babel">
  import { receiveChatNotify } from 'vuex/actions/chat.js'

  import * as messages from 'services/message';

  export default {
    ready() {
/*      // Listen server direct notify globally
      messages.onMsg(({response_map: {chat, messages}}) => {
        this.receiveChatNotify(chat.id, messages)
      });*/
    },
    vuex: {
      actions: {
        receiveChatNotify,
      }
    },
  }
</script>
