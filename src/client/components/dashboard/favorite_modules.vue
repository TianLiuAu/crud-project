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
        </tr>
        </thead>
        <tbody>
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
    },
    created() {
      this.getfavorite();
    }
  }
</script>

<style>

</style>
