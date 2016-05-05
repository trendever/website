<template lang="jade">

</template>

<script type="text/babel">
  import {
    receiveChangedStatusNotify,
    getAllLeads,
  } from 'vuex/actions';
  import { receiveChatNotify, setLeadStatus } from 'vuex/actions/chatActions.js'
  import * as messages from 'services/message';
  import * as leads from 'services/leads';

  export default {
    ready() {
/*      // Listen server direct notify globally
      messages.onMsg(({response_map: {chat, messages}}) => {
        this.receiveChatNotify(chat.id, messages)
      });*/

      leads.onChangeStatus(({response_map: {lead}}) => {
        this.receiveChangedStatusNotify(lead.status);
        this.setLeadStatus(lead.status);
      });

    },
    vuex: {
      actions: {
        receiveChatNotify,
        receiveChangedStatusNotify,
        setLeadStatus
      },
      getters: {}
    },
  }
</script>
