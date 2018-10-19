<!--template for left side bar,it contains three buttons: Choose Your Modules,Favorite Modules, Like Your Modules-->
<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" @click="modules_page">
                  <span data-feather="home"></span>
                  Choose Your Modules <span class="sr-only">(current)</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" @click="favorite_modules">
                  <span data-feather="file"></span>
                  Favorite Modules <span class="sr-only"></span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" @click="like_button_module">
                  <span data-feather="shopping-cart"></span>
                  Like Your Modules <span class="sr-only"></span>
                </a>
              </li>
            </ul>

            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <a class="d-flex align-items-center text-muted">
                <span data-feather="plus-circle"></span>
              </a>
            </h6>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // define errors for any returned error message
    data() {
      return {
        errors: []
      }
    },
    // define the methods used on the page
    methods: {
      modules_page() {
        // if click "Choose your Module", set the path as /admin/modules
        const VM = this;
        VM.$router.push('/admin/modules');
      },
      favorite_modules() {
        // if click "Favorite Module", set the path as /admin/favorite
        const VM = this;
        VM.$router.push('/admin/favorite');
      },
      like_button_module() {
        // if click "Like your Modules", set the path as /admin/likebutton
        const VM = this;
        VM.$router.push('/admin/likebutton');
      }
    }
  }
</script>
