<template lang="jade">
  .wrapper
   .header Оплачено
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
  .wrapper{
    height: 100%;
    background-color: #0E3333;
    color: #fff;
    font-size: 36px;
    text-align: center;
  }
  .header{
    font-size: 54px;
    padding-top: 50%;
    margin-bottom: 50px;
  }
  .link{
    color: #fff;
    border-bottom: 1px solid #fff !important;
  }
</style>
