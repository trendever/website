<template lang="jade">
#app-iframe
  scroll-component
    header-component(:title='getUserName', :left-btn-show='true')
    iframe.full-screen-iframe(:src="$route.query.src")

</template>

<script>
import { getUserName } from 'vuex/getters/user';
import HeaderComponent from 'base/header/header';
import ScrollComponent from 'base/scroll/scroll';
export default {
  vuex: {
    getters:{
      getUserName
    }
  },
  components:{
    HeaderComponent,
    ScrollComponent
  },

  data () {
    return {

    };
  }
};
</script>

<style lang="postcss">

#app-iframe {
  size: 100%;
  .full-screen-iframe {
    margin-top: 90px;
    size: 100%;
  }

}
</style>
