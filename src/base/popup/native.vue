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

  position: fixed 0 0 * 0;
  z-index: 110;
  size: 100%;
  background: rgba(0, 0, 0, 0.31);


  .popup-content {

    color: black;
    text-align: center;
    font-size: 20px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);


    @media (--mobile) {
      width: 80%;
      font-size: 36px;
    }

  }

  .main-text {
    background: #F5F5F6;
    border-bottom: 1px solid grey;

    padding: 20px 20px 20px 20px;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;

    @media (--mobile) {
      padding: 50px 50px 50px 50px;
      border-top-right-radius: 30px;
      border-top-left-radius: 30px;
    }


  }

  .button-text {
    background: #F5F5F6;
    color:#226ABB ;

    padding: * 20px 20px 20px;
    padding-top: 20px;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;

    @media (--mobile) {
      padding: * 50px 50px 50px;
      padding-top: 50px;
      border-bottom-right-radius: 30px;
      border-bottom-left-radius: 30px;
    }

    span {
      cursor: pointer;
      padding: * 50px * 50px;
      margin: * 10px * 10px;
    }
  }

}


</style>
