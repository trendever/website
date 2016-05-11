<template lang="jade">
    popup-wrapper(:show="isShowPopupSignup", :close="onClose")
</template>
<style>

</style>
<script>
    import popupWrapper from 'base/popup/wrapper.vue'
    export default {
        data() {
            return {};
        },
        components: {
            popupWrapper,
        },
    };
</script>