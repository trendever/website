<template>
  <div
    v-if="isShow"
    class="tags-container"
    :class="{'tags-container-open': isOpen || !hiddenContent, 'tags-container-button': hiddenContent && showMoreButton}"
  >
    <div class="tags" id="tags"
         :class="{'product_tags' : isProduct}"
         ref="tags"
         v-bind:style="tagsStyle">
         <div class="tag"
          v-bind:style="tagStyle"
          v-for="tag of filtredTags"
          :class="{'tag-active': tag.active}"
          v-on:click.stop="addTag(tag), open()">
<!--       <div class="tag"
     v-bind:style="tagStyle"
    v-for="tag of tags | filterBy searchString in 'name'"
     :class="{'tag-active': tag.active}"
     v-on:click.stop="addTag(tag), open()"> -->
        <span
          class="text"
          v-bind:style="textStyle">{{tag.name}}
        <i
          class="ic-close close"
          v-if="tag.active"
          v-on:click.stop="delTag(tag)"
          v-bind:style="iconStyle"></i>
        </span>
      </div>
    </div>
    <!-- <div class="button" v-on:click="open" v-if="hiddenContent && showMoreButton"></div> -->
    <div class="pending" v-if="isPending"></div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listener from 'event-listener'
  import { flex } from '../utils/flexWidth'
  import { browser } from 'utils'

  export default {
    props: {
      tags: {
        type: Array,
        default: []
      },
      maxHeight: {
        type: String,
        default: '285px'
      },
      baseHeight: {
        type: Number,
        default: 90
      },
      itemHeight: {
        type: String,
        default: null
      },
      textFontSize: {
        type: String,
        default: null
      },
      marginRight: {
        type: Number,
        default: 20
      },
      marginBottom: {
        type: Number,
        default: 12
      },
      iconFontSize: {
        type: String,
        default: null
      },
      textLineHeight: {
        type: String,
        default: null
      },
      hiddenContent: {
        type: Boolean,
        default: true
      },
      searchString: {
        type: String,
        default: ''
      },
      delTag: {
        type: Function,
        default: ( tag, index ) => {
          console.log( tag, index );
        }
      },
      addTag: {
        type: Function,
        default: ( tag, index ) => {
          console.log( tag, index );
        }
      },
      isOpen: {
        type: Boolean,
        default: false
      },
      isPending: {
        type: Boolean,
        default: false
      },
      isProduct:{
        type: Boolean,
        default: false
      }
    },

    data(){
      return {
        timer: null,
        showMoreButton: false,
        fullHeight: 0
      }
    },
    mounted(){

      this.$nextTick(()=>{

        this.onFlex = this.onFlex.bind( this );

        this.onFlex();

        this.resize = listener( window, 'optimizedResize', this.onFlex )

        this.$on( 'update', this.onFlex )

      })

    },

    beforeDestroy(){

      if ( this.resize ) {
        this.resize.remove()
      }
      this.$off( 'update', this.onFlex )
      clearTimeout( this.timer )
      this.timer = null;

    },

    computed: {
      filtredTags(){

        return this.tags/*.filter(tag=>{

          return tag.name === this.searchString;

        })*/
        //tag of tags | filterBy searchString in 'name'

      },
      tagsStyle(){
        return {
          maxHeight: this.maxHeight,
          height: (this.isOpen) ? null : this.height
        }
      },
      tagStyle(){

        return {
          height: this.itemHeight,
          marginBottom: `${this.marginBottom}px`
        }
      },
      textStyle() {
        return {
          height: this.itemHeight,
          fontSize: this.textFontSize,
          lineHeight: this.textLineHeight
        }
      },
      iconStyle(){
        return {
          fontSize: this.iconFontSize
        }
      },

      height(){

        if ( window.matchMedia( "(max-width: 750px)" ).matches ) {

          if ( this.fullHeight < 170 ) {

            return `${this.fullHeight - 10}px`;

          }

        } else {

          if ( this.fullHeight < this.baseHeight ) {

            return `${this.fullHeight - 10}px`

          }

        }

        if ( window.matchMedia( "(max-width: 750px)" ).matches ) {

          if ( this.baseHeight < 170 ) {
            //return `170px`;
            return `228px`;
          }

        }

        return `${this.baseHeight}px`;

      },

      isShow(){
        if ( Array.isArray( this.tags ) ) {

          return this.tags.length > 0;

        }

        return false;
      }

    },

    methods: {

      open(){
        if(!this.isOpen) {
          this.isOpen = true;
          this.$refs.tags.scrollTop = 0;
        }
      },

      onFlex(){

        if ( this.isShow ) {

          const computed = () => {

            if ( this.$refs.tags !== null ) {

              this.showMoreButton = this.$refs.tags.scrollHeight > (this.baseHeight + 10)

              Array
                .from( this.$refs.tags.children )
                .forEach( ( tag ) => {

                  tag.style.marginRight = '0';

                } );

              this.fullHeight = flex(
                Array.from( this.$refs.tags.children ),
                this.$refs.tags.clientWidth,
                this.marginRight
                )


            }

          };

          computed();

          if ( this.timer !== null ) {

            clearTimeout( this.timer )

          }

          this.timer = setTimeout( () => {

            this.timer = null ;

            computed();

          }, 100 ) ;

        }

      }

    },

    watch: {
      tags(){
        this.onFlex()
      },
      height(){
        this.onFlex()
      },
      maxHeight(){
        this.onFlex()
      },
      searchString(){
        this.onFlex()
      }
    }
  }
</script>
