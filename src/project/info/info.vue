<style src="./info.pcss"></style>
<template lang="jade">
div
  .section__content.info
    .info__container(:style="{minHeight: height}")
      .info__close(@click="back"): i.ic-close
      validator(v-if="showQuestion", name="question")
        .info__wrapper.__block-center(v-el:info)
          .info__title {{ mockup.title }}
          .info__body(@keyup.enter="send")
            .info__text {{ mockup.description }}
            .input
              input(type="email"
                placeholder="Введите свой email"
                v-model="email"
                v-validate:email="[ 'email' ]")
              .input__clear-btn(
                v-show="email.length"
                @click="email=''")
                i.ic-close
            .input
              input(type="text",
                :placeholder="mockup.commentPlaceholder",
                v-model="comment",
                v-validate:comment="[ 'required' ]")
              .input__clear-btn(
                v-show="comment.length"
                @click="comment=''")
                i.ic-close
        .info__main-btn.__bottom(
          :class="{ '__active': $question.valid }"
          @click="send") Отправить
      .info__wrapper(v-if="showThanks")
        .info__title.__block-center Запрос отправлен
        .info__main-btn.__active.__bottom(@click="back") Продолжить
      tr-spinner(v-if="showSpinner" color="white" size=60)
</template>

<script type="text/babel">
  import mockup from 'services/mockups/modal-data';
  import trSpinner from 'base/spinner/spinner.vue';
  import * as question from 'services/email';

  export default {
    data(){
      return {
        showQuestion: true,
        showThanks: false,
        showSpinner: false,
        mockup: '',
        type: '',
        email: '',
        comment: '',
      }
    },
    route: {
      activate() {
        var type = this.$route.params.type;
        this.$set('type', type);
        this.$set('mockup', mockup[type]);
      },
    },
    ready() {
      // TODO handler fo resize
      var height = window.innerHeight > 1.2 * this.$els.info.scrollHeight
        ? window.innerHeight : 1.2 * this.$els.info.scrollHeight
      this.$set('height',  `${ height }px`);
    },
    methods: {
      back() {
        mixpanel.track("Close Question Page", {type: this.$get('type')});

        var path = this.$router._currentTransition.from.path || {name: 'home'};
        this.$router.go(path);
      },
      send() {
        if (!this.$question.valid) { return; }

        var type = this.$get('type');
        var email = this.$get('email');
        var comment = this.$get('comment');

        mixpanel.track("Create Question", {type: type, email:email, comment:comment});

        this.$emit('hide:question');

        question.create( email, type, comment ).then(() => {

          this.$emit('show:thanks');

        }, ()=>{

          this.$emit('show:error');

        });

      },
    },
    events: {
      ['hide:question']() {
        this.$set('showQuestion', false);
        this.$set('showSpinner', true);
      },
      ['show:thanks']() {
        this.$set('showSpinner', false);
        this.$set('showThanks', true);
      },
      'show:error': 'back',
    },
    components: {
      trSpinner,
    }
  }
</script>
