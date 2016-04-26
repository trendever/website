<template lang="jade">

</template>

<script>
  import {
    receiveChatNotify,
    receiveChangedStatusNotify,
    getAllLeads,
  } from 'vuex/actions';
  import {
    currentLead
  } from 'vuex/getters';
  import store from 'vuex/store';
  import * as types from 'vuex/mutation-types';
  import * as messages from 'services/message';
  import * as leads from 'services/leads';

  export default {
    data: () => ({
    }),

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
      var self = this;
      // Listen server direct notify globally
      messages.onMsg(function(r){
        self.receiveChatNotify(r.response_map.chat.id);
        store.dispatch(types.RECEIVE_CHAT_MSG,
        r.response_map.chat.id, r.response_map.messages[0]);
      });

      leads.onChangeStatus(function(r){
        self.receiveChangedStatusNotify(r.response_map.lead.id, r.response_map.lead.status);
      });
    },

  }
</script>
