<template>
  <div>
    <div>
      <table class="table mt-4">
        <thead>
        <tr>
          <th>Module_ID</th>
          <th>Module_Name</th>
          <th>Coodinator</th>
          <th>Number of Likes</th>
          <th>Give A Like</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in modules" :key="item.module_id">
          <td>{{item.module_id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.coodinator}}</td>
          <td>{{item.numberlikes}}</td>
          <td>
            <input type="radio" id = "modules_id" v-model="selected" :value="item.module_id">
          </td>
        </tr>
        </tbody>
      </table>
      <div>Choose Modules: <strong>{{ selected }}</strong></div>
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(error) in errors" :key="error"><font color="red">{{ error }}</font></li>
      </ul>
      </p>
      <div class="text-right mt-4">
        <button class="btn-primary btn-group-lg btn-outline-primary" @click.prevent="likeModule">Give Your Like!!</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modules: [],
        selected: [],
        errors: []
      }
    },
    methods: {
      getfavorite() {
        const api = 'http://127.0.0.1:3000/modules/favorite';
        const vm = this;
        console.log(api);
        try{
          var token = localStorage.getItem('token').slice(1,-1);
        }catch (e) {
          console.log(e);
        }
        var config = {headers: {'x-access-token': token}};
        this.$http.get(api, config).then((response) => {
          console.log(response.data);
          vm.modules = response.data.modules;
        })
      },
      likeModule() {
        var choseModule = JSON.parse(JSON.stringify(this.selected));
        console.log("Seletec Module :",choseModule)
        const api = 'http://127.0.0.1:3000/modules/press/like';
        const vm = this;
        vm.errors = [];
        try{
          var token = localStorage.getItem('token').slice(1,-1);
          var email = localStorage.getItem('user').slice(1,-1);
          console.log(email)
        }catch (e) {
          console.log(e);
        }
        var data = {email: email, module_id: choseModule, token: token};
        this.$http.post(api, data)
          .then((response) => {
              console.log(response.data.success);
              if(response.data.success){
                alert("Modules ID "+choseModule+" Your Voted, Thank You ");
                vm.$router.go(0);
              }
            }
          )
          .catch((error) => {
            if (error.response.data) {
              console.log(error.response.data);
              this.errors.push(error.response.data.message);
            }
          })
      }
    },
    created() {
      this.getfavorite();
    }
  }
</script>

<style>

</style>
