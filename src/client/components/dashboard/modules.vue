<template>
  <div>
    <div class="text-right mt-4">
      <button class="btn-primary" @click="openModal">My Register Modules</button>
    </div>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>Module_ID</th>
        <th>Module_Name</th>
        <th>Coodinator</th>
        <th>Description</th>
        <th>Choose Module</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in modules" :key="item.module_id">
          <td>{{item.module_id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.coodinator}}</td>
          <td>{{item.description}}</td>
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
      <button class="btn-primary btn-group-lg btn-outline-primary" @click.prevent="chooseModules">Submit Your Selected Modules</button>
    </div>

    <div class="modal fade" id="modulesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document" style="max-width: 1350px!important; max-height: 1200px!important">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div id="_modalDialog_body" class="modal-body">
            <table class="table mt-4">
              <thead>
              <tr>
                <th>Module_ID</th>
                <th>Module_Name</th>
                <th>Coodinator</th>
                <th>Description</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item) in chosenmodules" :key="item.module_id">
                <td>{{item.module_id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.coodinator}}</td>
                <td>{{item.description}}</td>
              </tr>
              </tbody>
            </table>
            <br/>
            <h2 class="sub-header">Timetable</h2>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                <tr>
                  <th>ModuleID</th>
                  <th>weekday</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
                </thead>
                <tbody>
                <tr  v-for="(item) in timetables" :key="item.module_id">
                  <td>{{item.module_id}}</td>
                  <td>{{item.weekday}}</td>
                  <td>{{item.start_time}}</td>
                  <td>{{item.end_time}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import $ from 'jquery';
  export default {
    data() {
      return {
        modules: [],
        timetables: [],
        chosenmodules: [],
        selected: [],
        errors: [],
      }
    },
    methods: {
      getModules() {
        const api = 'http://127.0.0.1:3000/modules';
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
      openModal() {
        $('#modulesModal').modal('show');
      },
      getTimetables_Modules_By_user() {
        const api = 'http://127.0.0.1:3000/user/modules/list/timetable';
        const vm = this;
        try{
          var token = localStorage.getItem('token').slice(1,-1);
          var email = localStorage.getItem('user').slice(1,-1);
          console.log(email)
        }catch (e) {
          console.log(e);
        }
        var config = {headers: {'x-access-token': token}, params: {'email': email}};
        this.$http.get(api, config).then((response) => {
          console.log(response.data)
          vm.chosenmodules = response.data.modules;
          vm.timetables = response.data.times;
        })
      },
      chooseModules() {
        var choseModule = JSON.parse(JSON.stringify(this.selected));
        console.log(choseModule);
        const api = 'http://127.0.0.1:3000/modules/choose';
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
        console.log(data);
        this.$http.post(api, data)
          .then((response) => {
          if(response.data.success){
            alert("Modules ID "+choseModule+" Already Chosen, Please Check Your Registered Modules");
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
      this.getModules();
      this.getTimetables_Modules_By_user();
    }
  }
</script>
