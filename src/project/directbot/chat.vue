<template lang="jade">
#directbot-chat
  chat-component(:directbot="true")

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
@import 'base/vars/vars.pcss';
#directbot-chat {

  height: 100%;
  .header {
    .wrapper {
      background: $color__blue;
    }
  }
  .loader-wrapper {
    & > div {
      background-color: $color__blue !important;
    }
  }
  .chat-list-i {
    .body-notify {
      background: $color__blue;
    }
  }
  .scroll-top {
    background: $color__blue;
    opacity: 0.8;
  }
}

</style>
