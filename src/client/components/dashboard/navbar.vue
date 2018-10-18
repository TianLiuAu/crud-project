<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
      <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
        <label>
          <button class="btn btn-outline-light" @click="signout" >Sign Out</button>
        </label>
    </nav>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        errors: []
      }
    },
    methods: {
      signout() {
        const vm = this;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        vm.$router.push('/login');
      }
    }
  }
</script>
