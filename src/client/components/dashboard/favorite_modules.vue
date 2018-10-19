<!--This page display when user click "Favorite Module" Button;
get module data from backend-->
<template>
  <div>
    <div>
      <table class="table mt-4">
        <thead>
        <tr>
          <!--show column name of the table-->
          <th>Module ID</th>
          <th>Module Name</th>
          <th>Coordinator</th>
          <th>Likes</th>
        </tr>
        </thead>
        <tbody>
        <!--display the module data line by line-->
        <tr v-for="(item) in modules" :key="item.module_id">
          <td>{{item.module_id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.coodinator}}</td>
          <td>{{item.numberlikes}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        modules: [],
      }
    },
    methods: {
      get_favorite() {
        // define the get path to /modules/favorite in the backend
        const API = 'http://127.0.0.1:3000/modules/favorite';
        const VM = this;
        console.log(API);

        //check if the user has the correct token information
        try{
          var token = localStorage.getItem('token').slice(1,-1);
        }catch (e) {
          console.log(e);
        }

        //send get to the backend
        var config = {headers: {'x-access-token': token}};
        this.$http.get(API, config).then((response) => {
          console.log(response.data);
          VM.modules = response.data.modules;
        })
      },
    },
    created() {
      // call the get favorite method when the page created
      this.get_favorite();
    }
  }
</script>
