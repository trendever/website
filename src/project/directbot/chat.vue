<template lang="jade">
#directbot-chat
  chat-component(:direct-bot="true")

</template>

<script>
import ChatComponent from 'project/chat/index';
export default {
  components: {
    ChatComponent
  }
};
</script>

<style lang="postcss">

#directbot-chat  {
  height: 100%;


}

</style>
