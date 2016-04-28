<template lang="jade">

</template>

<script type="text/babel">
  import {
    receiveChatNotify,
    receiveChangedStatusNotify,
    getAllLeads,
  } from 'vuex/actions';

  import {
    currentLead
  } from 'vuex/getters';

  import * as messages from 'services/message';
  import * as leads from 'services/leads';

  export default {
    vuex: {
      actions: {
        receiveChatNotify,
        receiveChangedStatusNotify,
      },
      getters: {
        currentLead
      }
    },

    ready() {
      // Listen server direct notify globally
      messages.onMsg(({response_map: {chat, messages}}) => {
        this.receiveChatNotify(chat.id, messages)
      });

      leads.onChangeStatus(({response_map: {lead}}) => {
        this.receiveChangedStatusNotify(lead.id, lead.status)
      });
    },
  }
</script>
