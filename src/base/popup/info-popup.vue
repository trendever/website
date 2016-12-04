<template lang="jade">

#info-popup(v-if="showPopup")
  .popup-content
    slot

</template>

<script>
export default {
  props: {
    showPopup: {
      default: false
    }
  }
};
</script>
<style lang="postcss">
@import 'base/vars/vars.pcss';

  #info-popup{
    width: 100%;
    height: 100%;
    z-index: 110;
    position: fixed 0 0 * 0;

    .popup-content{
      width: 600px;
      height: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
    }

    i.ic-close{
  		position: absolute;
  		color: $color__white;
  		font-size: 23px;
  		top: 24px;
  		right: 24px;
      cursor: pointer;
    }
  }

</style>
