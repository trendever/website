<template lang="jade">
#app-loader
  .loader-wrapper(:class="{'directbot-color': directbot, 'native': !directbot}")
    .bounce1
    .bounce2
    .bounce3

</template>


<script type='text/babel'>
import settings from 'settings';
export default {

  data(){
    return {
      directbot: settings.directbotActive
    }
  }

}

</script>

<style lang="postcss">
@import 'base/vars/vars.pcss';

#app-loader {
  .loader-wrapper {
    width: 70px;
    text-align: center;
    margin: 0 auto;


    &.directbot-color > div {
      background-color: $color__blue !important;
    }

    &.native > div {
      width: 18px;
      height: 18px;
      background-color: $color__green !important;

      border-radius: 100%;
      display: inline-block;
      -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }

    .bounce1 {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }

    .bounce2 {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }

  }
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}


</style>
