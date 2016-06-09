<style src="./style.pcss"></style>
<template lang='jade'>
.scroll-top(@click='up()',
            v-show="is_visible",
            :class='{"__fly": !isAuth}')
  i.ic-arrow-up-thin
</template>

<script>
import listen from 'event-listener';
import { isAuth } from 'vuex/getters/user.js';

export default {
  data(){
    return {
      is_visible: false,
    }
  },
  ready() {
    this.scrollCnt = document.querySelector('.scroll-cnt')
    this.toggleBtnOnScroll()
    this.scrollEvent = listen(this.scrollCnt, 'scroll', this.toggleBtnOnScroll.bind(this))
  },
  beforeDestroy() {
    if ( this.scrollEvent ) {
      this.scrollEvent.remove();
    }
  },
  methods: {
    toggleBtnOnScroll(){
      if (this.scrollCnt.scrollTop - (document.body.offsetHeight * 2) >= 0) {
        this.is_visible = true
      } else {
        this.is_visible = false
      }
    },
    up() {
      var top = this.scrollCnt.scrollTop;
      if(top > 0) {
        this.scrollCnt.scrollTop = top - top/5;
        var t = setTimeout(this.up, 20);
      } else clearTimeout(t);
      return false;
    }
  },
  vuex: {
    getters: {
      isAuth
    }
  },
}
</script>
