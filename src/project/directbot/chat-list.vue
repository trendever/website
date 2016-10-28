<template lang="jade">
#direct-bot-char-list
  chat-list(:directbot="true")

</template>

<script>

import ChatList from 'project/chat-list/index';
export default {
  components: {
    ChatList
  },
  data () {
    return {

    };
  }
};
</script>

<style lang="postcss">
@import 'base/vars/vars.pcss';
#direct-bot-char-list {

  .header {
    .wrapper {
      background: $color__blue;



    }
  }
}



</style>
