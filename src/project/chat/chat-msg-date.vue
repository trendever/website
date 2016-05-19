<style src="./styles/chat-msg-date.pcss"></style>
<template lang="jade">
.chat-row.__center
  .chat-msg-date
    span {{getCreateData}}

</template>

<script>
  import {getCreateData} from 'vuex/getters/chat.js'
  export default{
    vuex:{
      getters:{
        getCreateData
      }
    }
  }
</script>