<!--this file defines the page structure of the overall windows
import navigation bar and side bar as its components-->
<template>
  <div>
  <NavBar/>
  <div class="container-fluid">
    <div class="row">
      <SideBar/>
      <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
  </div>
</template>

<script>
  import NavBar from './navbar';
  import SideBar from './sidebar';
  export default {
    components:{
      //configure two components: sidebar and navigation bar
      SideBar,
      NavBar,
    },
  }
</script>
