<template>
  <div>
    <form class="form-signin" @submit.prevent="register">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="user_register.email" placeholder="Enter email" required>
        <small id="emailHelp" class="form-text text-muted">Please use UTS email address</small>
      </div>
      <div class="form-group">
        <label for="">Password</label>
        <input type="password" class="form-control" id="" placeholder="Password" v-model="user_register.password" required>
      </div>
      <div class="form-group">
        <label for="">Name</label>
        <input type="text" class="form-control" name="name" placeholder="Name" v-model="user_register.name" required>
      </div>
      <div class="form-group">
        <label for="">Age</label>
        <input type="number" class="form-control" name="age" placeholder="Age" v-model="user_register.age" required>
      </div>
      <div class="form-group">
        <label for="">Address</label>
        <input type="text" class="form-control" name="address" placeholder="Address" v-model="user_register.address" required>
      </div>
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(error) in errors" :key="error"><font color="red">{{ error }}</font></li>
      </ul>
      </p>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        user_register: {
          username: '',
          password: '',
          email: '',
          age: '',
          address: ''
        },
        errors: []
      }
    },
    methods: {
      register() {
        const api = 'http://localhost:3000/login/new';
        const vm = this;
        vm.errors = [];
        this.$http.post(api, vm.user_register)
          .then((response) => {
            if (response.data.success) {
              //store.set('token',{name:response.data.token})
              console.log(response.data);
              alert("Register Success");
              vm.$router.push('/login');
            }
          })
          .catch((error) => {
            if (error.response.data){
              console.log(error.response.data);
              this.errors.push(error.response.data.message);
            }
          })
      },
    }
  }
</script>

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

