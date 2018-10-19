<!--this file define the navigation bar on the top of the page
it contains the Title of the application and the sign out button-->
<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">TimeTable</a>
        <label>
          <button class="btn btn-outline-light" @click="sign_out" >Sign Out</button>
        </label>
    </nav>
  </div>
</template>

<script>
  export default {
    // define error list to get the error information
    data() {
      return {
        errors: []
      }
    },

    methods: {
      //define one method of sign out
      //it would remove user information and the token from local storage
      //and redirect to login page
      sign_out() {
        const VM = this;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        VM.$router.push('/login');
      }
    }
  }
</script>
