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


#native-popup {

  position: fixed 0 0 * 0;
  z-index: 110;
  size: 100%;
  background: rgba(0, 0, 0, 0.31);


  .popup-content {

    color: black;
    text-align: center;
    font-size: 36px;

    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .main-text {
    background: #F5F5F6;
    border-bottom: 1px solid grey;
    padding: 50px 50px 50px 50px;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;

  }
  .button-text {
    background: #F5F5F6;
    color:#226ABB ;
    padding: * 50px 50px 50px;
    padding-top: 50px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
  }
}


</style>
