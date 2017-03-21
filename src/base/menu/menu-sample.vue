<template lang="jade">
#menu-sample(v-if="opened", @click="$emit('close')")
  .content
    slot
      template(v-if="false")
        .item
          .text Выход

</template>

<script>

  export default{
    props: {
      opened: {
        default: false
      }
    }
  }
</script>
<style lang="postcss">

@import 'base/vars/vars.pcss';


#menu-sample {

  &::after, &::before {
    transform: rotate(180deg);
  }

  &::before {
    content: '';
    position: absolute -13px 23px * *;
    size: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-top: 13px solid $color__gray-light;

  }

  &::after {
    content: '';
    position: absolute -12px 23px * *;
    z-index: 9999;
    size: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-top: 13px solid #F0F0F0;

  }


  box-sizing: border-box;
  border-radius: 5px;
  background: #ececec;
  position: absolute 60px 10px * * ;
  z-index: 150;
  height: auto;
  width: 210px;


  @media (--overmobile) {
    box-shadow: 1px 1px 5px #595959;
    &.prof-menu {
      width: 242px;
    }
  }

  @media (--mobile) {
    margin-top: -1px;
    border-radius: 0px;
    position: fixed 0 0 * 0;
    z-index: 179;
    size: 100%;
    width: 100%;
    height: 100%;
    background: $color__blue-opacity;
  }

  .content {

    @media (--overmobile) {

      :first-child{
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
      }

      :last-child {
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }

    }


    .item {

      @media (--mobile) {
        &:hover {
          background: #dedede;
          cursor: pointer;
          .text {
            color: $color__blue
          }
        }
      }

      font-family: $font__family__regular;
      text-align: left;
      font-size: 24px;
      line-height: 45px;
      height: 45px;

      @media (--mobile) {
        background: #dedede;
        padding-top: 1px;
        text-align: center;
        font-size: 36px;
        line-height: 97px;
        height: 97px;
      }

      .text {

        color: #595959;
        background: white;

        @media screen and (--overmobile){

          padding-left: 30px;

        }
        &.__txt-green {
            color: $color__green;
        }
        &.__txt-blue {
            color: $color__blue;
        }

        &.__txt-red {
            color: $color__red;
        }

        &.__txt-black {
            color: black;
        }
      }
    }
  }
}




</style>


