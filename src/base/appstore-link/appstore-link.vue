<style lang="postcss">
.container-left {

  .hero__content__input-wrap {
    padding-top: 0;
    margin: 0 auto;
  }

}


</style>

<template lang="jade">
.hero__content__input-wrap
  input(type="text" placeholder="Номер телефона" v-model="phoneNumber")
  button.hero__content__get-link(@click="getLink()" v-bind:disabled="disableButton") {{getLinkTitle}}
</template>

<script>
import * as commonService from 'services/common';
export default {

  name: 'component_name',

  data () {
    return {
      phoneNumber: '',
      smsSent: false,
      phoneError: false
    };
  },
  computed: {
    getLinkTitle(){
        if (this.phoneError){
          return "НЕВЕРНЫЙ НОМЕР";
        }
        if (this.smsSent){
          return "ОТПРАВЛЕНО";
        }else{
          return "ПОЛУЧИТЬ ССЫЛКУ";
        }
      },
    disableButton(){
      if (this.phoneNumber.length >= 11 && !this.phoneError){
        return false;
      }else{
         return true;
      }
    }
  },
  methods:{
    getLink(){
      commonService.marketSms({phone: this.phoneNumber }).then(data=>{
          this.$set('smsSent', true);
          this.$set('phoneNumber','');
          setTimeout( () => this.$set('smsSent', false), 3000);
        },err=>{
          this.$set('phoneError',true);
          setTimeout( () => this.$set('phoneError', false), 3000);
        }
      );
    },
  }
};
</script>

<style lang="css" scoped>
</style>
