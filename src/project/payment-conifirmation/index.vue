<template lang="jade">
  .wrapper
   .header-pay Оплачено
   .text Направляем обратно в чат #[br] или
   a(href="#").link нажми здесь
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
@import 'base/vars/vars.pcss';
  .wrapper{
    height: 100%;
    background-color: #0E3333;
    color: #fff;
    font-size: 36px;
    text-align: center;
    font-family: $font__family__regular;
  }
  .header-pay{
    font-size: 54px;
    padding-top: 50%;
    margin-bottom: 50px;
  }
  .link{
    color: #fff;
    border-bottom: 1px solid #fff !important;
  }
</style>
