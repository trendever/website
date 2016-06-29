<style src='./styles/search.pcss'></style>
<template lang="jade">
.search-placeholder
  #search
    .search-stub(v-if='searchGlued')

    .search-input(:class='{"glued":searchGlued}')
      .search-input__container(:class='{"__focused": inputFocused, "__active": searchValue.length || selectedCount > 0}')
        .search-input__search-btn(@click='search()')
          i.ic-search.__mirror

        input.search-input__input(
          v-el:input,
          @keydown='search()',
          :value='searchValue',
          @focus='onFocusInput',
          @blur='onBlurInput',
          type='text',
          placeholder='Поиск текстом...'
        )

        .search-input__clear-btn
          span.badge(v-if='selectedCount > 0', @click='clear') {{ selectedCount }}
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
        :search-string="searchValue",
        :del-tag="removeTag",
        :add-tag="selectTag",
        :is-open.sync="isOpenTags",
        :is-pending="getPendingStatus"
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
    created() {
      return this.loadTags();
    },
    methods: {

      clear(){
        this.clearSearch();
        this.scrollCnt.scrollTop = 0;
      },

      search() {
        this.setSearchValue( this.$els.input.value );
      },
      onFocusInput() {
        this.$set('isOpenTags', false)
        this.inputFocused = true;
      },
      onBlurInput() {
        this.inputFocused = false;
      }
    }
  }
</script>
