<!--This page shows when user click "Choose Your Module" Button;-->
<!--It contains module data send from backend;-->
<!--User can also select module and this data will send to backend;-->
<!--There's also a popup page for the list of select module details-->
<template>
  <div>
    <div class="text-right mt-4">
      <button class="btn-primary" @click="open_modal">My Register Modules</button>
    </div>
    <table class="table mt-4">
      <thead>
      <tr>
        <!--the column name of the table-->
        <th>Module ID</th>
        <th>Module Name</th>
        <th>Coordinator</th>
        <th>Description</th>
        <th>Choose Module</th>
      </tr>
      </thead>
      <tbody>
      <!--module information display in the table-->
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
      <button class="btn-primary btn-group-lg btn-outline-primary" @click.prevent="choose_modules">Submit Your Selected Modules</button>
    </div>

    <!--the pop up page of module details-->
    <div class="modal fade" id="modulesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document" style="max-width: 1350px!important; max-height: 1200px!important">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Module Detail</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div id="_modalDialog_body" class="modal-body">
            <table class="table mt-4">
              <thead>
              <tr>
                <th>Module ID</th>
                <th>Module Name</th>
                <th>Coordinator</th>
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
                  <th>Module ID</th>
                  <th>Weekday</th>
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
  // jquery used here only for the pop up page
  import $ from 'jquery';

  export default {
    data() {
      return {
        // the data would be modules from the backend
        modules: [],
        // the data would be timetable information from the backend
        timetables: [],
        // store the chosen module
        chosenmodules: [],
        // store the selected module
        selected: [],
        // store the error message
        errors: [],
      }
    },

    methods: {
      /**
       * get module information
       */
      get_modules() {
        //call backend /modules
        const MOD_API = 'http://127.0.0.1:3000/modules';
        const VM = this;
        console.log(MOD_API);

        //check if the user has the right token to connect to backend
        try{
          var token = localStorage.getItem('token').slice(1,-1);
        }catch (e) {
          console.log(e);
        }

        //send the get request with header that has token
        var config = {headers: {'x-access-token': token}};
        this.$http.get(MOD_API, config).then((response) => {
          console.log(response.data);
          VM.modules = response.data.modules;
        })
      },

      //the pop up page of selected module details
      open_modal() {
        $('#modulesModal').modal('show');
      },

      /**
       * get user module
       */
      get_timetables_modules_by_user() {
        //call backend /modules/list/timetable
        const TAB_API = 'http://127.0.0.1:3000/user/modules/list/timetable';
        const VM = this;

        //check if the user has the right token to connect to backend
        try{
          var token = localStorage.getItem('token').slice(1,-1);
          var email = localStorage.getItem('user').slice(1,-1);
          console.log(email);
        }catch (e) {
          console.log(e);
        }

        //send the get request with header that has token
        var config = {headers: {'x-access-token': token}, params: {'email': email}};
        this.$http.get(TAB_API, config).then((response) => {
          console.log(response.data);
          VM.chosenmodules = response.data.modules;
          VM.timetables = response.data.times;
        })
      },
      /**
       * user choose a new module
       */
      choose_modules() {
        //get which module has been chosen
        var choseModule = JSON.parse(JSON.stringify(this.selected));
        console.log(choseModule);

        //call backend /modules/choose
        const MOD_API = 'http://127.0.0.1:3000/modules/choose';
        const VM = this;
        VM.errors = [];

        //check if the user has the right token to connect to backend
        try{
          var token = localStorage.getItem('token').slice(1,-1);
          var email = localStorage.getItem('user').slice(1,-1);
          console.log(email);
        }catch (e) {
          console.log(e);
        }

        // send data to backend
        var data = {email: email, module_id: choseModule, token: token};
        console.log(data);
        this.$http.post(MOD_API, data)
          .then((response) => {
          if(response.data.success){
            // show pop up box of modules already chose
            alert("Modules ID "+choseModule+" Already Chosen, Please Check Your Registered Modules");
            VM.$router.go(0);
          }
        })
          .catch((error) => {
          if (error.response.data) {
            console.log(error.response.data);
            this.errors.push(error.response.data.message);
          }
        })
      }

    },
    created() {
      // display module information when the windows created
      this.get_modules();
      this.get_timetables_modules_by_user();
    }
  }
</script>
