<template lang="jade">

#native-popup(v-if="showPopup")
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

#native-popup {
  font-family: $font__family__regular;
  position: fixed 0 0 * 0;
  z-index: 110;
  size: 100%;
  background: rgba(0, 0, 0, 0.31);


  .popup-content {
    background: #F5F5F6;
    color: black;
    text-align: center;
    font-size: 20px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: 15px;
    overflow: hidden;

    @media (--mobile) {
      border-radius: 30px;
      width: 75%;
      font-size: 32px;
    }

  }

  .title-font {
    font-family: $font__family__semibold;
    font-size: 40px;
  }

  .title-text {

    padding: 30px 10px * 10px;

    @media (--mobile) {
      padding: 50px 30px 10px 30px;

    }

  }

  .main-text {

    padding: * 5px 30px 5px;

    @media (--mobile) {
      padding: * 10px 50px 10px;

    }

  }

  .button-text {
    font-family: $font__family__semibold;
    border-top: 1px solid grey;
    color:#226ABB ;
    padding: 20px 20px 20px 20px;

    @media (--mobile) {
      padding: 30px 30px 30px 30px;
      font-size: 36px;
    }

    span {
      cursor: pointer;
      padding: * 50px * 50px;
      margin: * 10px * 10px;
    }
  }

}


</style>
