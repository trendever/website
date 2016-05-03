<style src="./styles/hero.pcss"></style>
<template src="./jade/hero.jade" lang="jade"></template>
<script type="text/babel">
    import { isAuth } from 'vuex/getters';
    export default {
        vuex: {
            getters: {
                isAuth,
            },
        },
    };
</script>
