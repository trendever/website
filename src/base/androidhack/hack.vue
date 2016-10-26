<script type="babel">
export default {
  ready(){
    Window.androidhack = 1;
    this.$router.push({name:"home"});
  }
};
</script>