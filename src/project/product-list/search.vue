<style src='./styles/search.pcss'></style>
<template lang="jade">
.search-placeholder
  #search
    .search-stub(v-if='searchGlued')

    .search-input(:class='{"glued":searchGlued}', v-if="isAuth")
      .search-input__container(:class='{"__focused": inputFocused, "__active": searchValue.length || selectedCount > 0}')
        .search-input__search-btn(@click='search()')
          i.ic-search.__mirror

        input.search-input__input(
          v-el:input,
          @keyup='search()',
          :value='searchValue',
          @focus='onFocusInput',
          @blur='onBlurInput',
          type='text',
          placeholder='Ищи текстом или жми теги...'
        )

        .search-input__clear-btn
          span.badge(v-if='selectedCount > 0') {{ selectedCount }}
          span.close(v-show='searchValue.length || selectedCount > 0', @click='clear'): i.ic-close
          span.change-col
            span.change-col__two-col( :class='{"active": getColumnCount === 3}', @click='setColumnNumber(2)')
              span.change-col__big
              span.change-col__big
              span.change-col__big
              span.change-col__big

            span.change-col__three-col( :class='{"active": getColumnCount === 2}', @click='setColumnNumber(3)')
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm
              span.change-col__sm

    .tags-wrapper( v-el:tags )
      tags-component(
        :tags="tags",
        :text-font-size="tagsFontSize",
        :text-line-height="tagsLineHeight",
        :search-string="searchValue",
        :del-tag="removeTag",
        :add-tag="selectTag",
        :is-open.sync="isOpenTags",
        :is-pending="getPendingStatus",
        :margin-bottom="marginBottom",
        :margin-right="marginRight",
        :base-height="baseHeight"

      )
</template>

<script type='text/babel'>
  import listen from 'event-listener';
  import tagsComponent from 'base/tags/index.vue';

  import { searchValue, tags, selectedCount, getPendingStatus } from 'vuex/getters/search.js';
  import { loadTags, setSearchValue, selectTag, removeTag, clearSearch } from 'vuex/actions/search.js';

  import { isAuth } from 'vuex/getters/user.js';
  import { setColumnNumber } from 'vuex/actions/products';
  import { getColumnCount } from 'vuex/getters/products';


  export default {
    components: {
      tagsComponent
    },
    data(){
      return {
        searchGlued: false,
        inputFocused: false,
        isOpenTags: false
      }
    },
    ready(){

      if ( this.isAuth ) {

        this.scrollCnt = document.querySelector( '.scroll-cnt' );

        this.gluingSearch = listen( this.scrollCnt, 'scroll', () => {

          if ( this.isAuth ) {

            let searchHeight = 50;

            if ( window.matchMedia( '(max-width: 750px)' ).matches ) {

              searchHeight = 100;

            }

            if ( this.scrollCnt.scrollTop > searchHeight ) {

              this.$set( 'searchGlued', true );

            } else {

              this.$set( 'searchGlued', false );

            }

          }

        } );

      }

    },
    beforeDestroy(){

      if ( this.isAuth ) {

        if ( this.gluingSearch ) {

          this.gluingSearch.remove();

        }

      }

    },
    vuex: {
      getters: {
        searchValue,
        tags,
        selectedCount,
        getColumnCount,
        isAuth,
        getPendingStatus
      },
      actions: {
        loadTags,
        setSearchValue,
        setColumnNumber,
        selectTag,
        removeTag,
        clearSearch
      }
    },
    activate(done) {

      this.loadTags().then(() => {
        done();
      });

    },
    computed:{
      baseHeight(){
        if(!window.matchMedia('(max-width: 750px)').matches){
          return 78;
        } else {
          return;
        }
      },
      marginBottom(){
        if(window.matchMedia('(max-width: 750px)').matches){
          return;
        } else {
          return 5;
        }

      },
      marginRight(){
        if(window.matchMedia('(max-width: 750px)').matches){
          return;
        } else {
          return 5;
        }
      },
      tagsFontSize(){
        if(window.browser.mobile){
          return null;
        }
        return '16px';

      },
      tagsLineHeight(){
        if(window.matchMedia('(max-width: 750px)').matches){
          return '37px';
        } else {
          return '28px';
        }

      }
    },
    methods: {

      clear(){
        this.clearSearch();
        this.scrollCnt.scrollTop = 0;
        this.$set('isOpenTags', false);
      },

      search() {
        this.setSearchValue( this.$els.input.value );
      },
      onFocusInput() {
        this.$set('isOpenTags', true)
        this.inputFocused = true;
      },
      onBlurInput() {
        this.inputFocused = false;
      }
    }
  }
</script>
