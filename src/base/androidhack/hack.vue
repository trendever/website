<script type="babel">
export default {
  ready(){
  	Window.androidhack = 1;
  	this.$router.go({name:"home"});
  }
};
</script>