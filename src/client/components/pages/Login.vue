<template>
  <div>
    <form class="form-signin" @submit.prevent="signin">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="user.username" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="user.password" required>
      <div class="checkbox mb-3">
        <label>
        <button class="btn btn-primary btn-block" @click="goRegister" >Register</button>
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
      <ul>
      <li v-for="(error) in errors" :key="error"><font color="red">{{ error }}</font></li>
      </ul>
      </p>
      <!--<p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>-->
    </form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        user: {
          username: '',
          password: '',
          token: '',
        },
        errors: []
      }
    },
    methods: {
      signin() {
        const api = 'http://localhost:3000/login';
        const vm = this;
        vm.errors = [];
        //console.log(vm);
        this.$http.post(api, vm.user)
          .then((response) => {
          if (response.data.success) {
            //store.set('token',{name:response.data.token})
            console.log(response.data);
            localStorage.setItem('token',JSON.stringify(response.data.token));
            localStorage.setItem('user',JSON.stringify(vm.user.username));
            //alert(store.get('token'))
            vm.$router.push('/admin/modules');
          }
        })
          .catch((error) => {
            if (error.response.data){
              console.log(error.response.data);
              this.errors.push(error.response.data.message);
            }
          })
      },
      goRegister() {
        this.$router.push({path: '/register'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,
  body {
    height: 100%;
  }

  body {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
  }
  .form-signin .checkbox {
    font-weight: 400;
  }
  .form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
  }
  .form-signin .form-control:focus {
    z-index: 2;
  }
  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
