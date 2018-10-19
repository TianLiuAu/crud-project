<!--create the basic template for the overall web page structure-->
<template>
  <div id='app'>
    <router-view/>
  </div>
</template>

<!--connect the template with App as default -->
<script>
export default {
  name: 'App',
}
</script>

<!--configure the style directory-->
<style lang='scss'>
  @import '../assets/all';
</style>
