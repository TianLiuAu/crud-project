<!--this page show when user click "Like your Module" button;-->
<!--It call module information from the backend;-->
<!--User can input by click the radio button -->
<template>
  <div>
    <div>
      <table class="table mt-4">
        <thead>
        <tr>
          <!--title of the table-->
          <th>Module ID</th>
          <th>Module Name</th>
          <th>Coordinator</th>
          <th>Likes</th>
          <th>Like Module</th>
        </tr>
        </thead>
        <tbody>
        <!--iterate the items of module data sent from backend-->
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
      <div><strong>Choose Modules: {{ selected }}</strong></div>
      <p v-if="errors.length">
        <b>Please correct the following error:</b>
      <ul>
      <!--show error information-->
        <li v-for="(error) in errors" :key="error"><font color="red">{{ error }}</font></li>
      </ul>
      </p>
      <div class="text-right mt-4">
        <button class="btn-primary btn-group-lg btn-outline-primary" @click.prevent="like_module">Give Your Like!</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //the data would be modules from the backend
        modules: [],
        //the module selected by user
        selected: [],
        //the error message
        errors: []
      }
    },
    methods: {
      /**
       * get the module data from backend
       */
      get_favorite() {
        //call backend /modules/favorite
        const FAV_API = 'http://127.0.0.1:3000/modules/favorite';
        const VM = this;

        //check if the user has the right token to connect to backend
        try{
          var token = localStorage.getItem('token').slice(1,-1);
        }catch (e) {
          console.log(e);
        }

        //send the get request with header that has token
        var config = {headers: {'x-access-token': token}};
        //get module data from backend
        this.$http.get(FAV_API, config).then((response) => {
          console.log(response.data);
          VM.modules = response.data.modules;
        })
      },

      /**
       * send the user liked module to backend
       */
      like_module() {
        //get the module been selected from the windows
        var choseModule = JSON.parse(JSON.stringify(this.selected));
        console.log("Select Module :",choseModule);

        //call backend modules/press/like
        const LIKE_API = 'http://127.0.0.1:3000/modules/press/like';
        const VM = this;
        VM.errors = [];

        //check if the user has the right token to connect to backend
        try{
          var token = localStorage.getItem('token').slice(1,-1);
          var email = localStorage.getItem('user').slice(1,-1);
          console.log(email)
        }catch (e) {
          console.log(e);
        }

        // post the liked module to the backend with user information and module information
        var data = {email: email, module_id: choseModule, token: token};
        this.$http.post(LIKE_API, data)
          .then((response) => {
              console.log(response.data.success);
              if(response.data.success){
                // if post data success, send one message to the front end to notice the user
                alert("Modules ID "+choseModule+" Your Voted, Thank You ");
                VM.$router.go(0);
              }
            }
          )
          .catch((error) => {
            // if error occurs, send the error message to frontend
            if (error.response.data) {
              console.log(error.response.data);
              this.errors.push(error.response.data.message);
            }
          })
      }
    },
    created() {
      // call the get favorite method when the page created
      this.get_favorite();
    }
  }
</script>

