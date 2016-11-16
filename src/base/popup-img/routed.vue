<template lang="jade">

popup-img(v-if="imgPopUpUrl", :url="imgPopUpUrl", :width="imgWidth", :height="imgHeight", :on-close="closePopUp")

</template>

<script>
import Vue from 'vue';
import popupImg from './index';

import { openPopUp } from 'vuex/actions/chat';

import { imgWidth, imgHeight, imgPopUpUrl  } from 'vuex/getters/chat';


export default {

  vuex:{

    actions: {

      openPopUp

    },
    getters: {
      imgWidth,
      imgHeight,
      imgPopUpUrl
    }

  },
  components: {

    popupImg

  },
  methods: {
    closePopUp(){
      let id = this.$route.query.chatid;
      if(id){
        this.$router.replace({name: 'chat', params: {id: id}});
        this.openPopUp();
      }
    }
  }
};
</script>


<style lang="postcss">
</style>
