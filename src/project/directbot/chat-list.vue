<template lang="jade">
#directbot-chat-list
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
#directbot-chat-list {

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
