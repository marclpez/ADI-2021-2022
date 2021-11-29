<template>
    <div>
        
        <b-navbar toggleable="lg" type="dark" variant="info">
            <img src="../assets/logo.png" width="50px" height="50px">
            <b-navbar-brand v-href="tweets()">TWITTER</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item v-on:click="tweets()">Muro principal</b-nav-item>
                <b-nav-item href="#tustweets">Mis tweets</b-nav-item>
                <b-nav-item v-on:click="seguidores()">Seguidores</b-nav-item>
                <b-nav-item v-on:click="seguidos()">Seguidos</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <em>{{username}}</em>
                </template>
                <b-dropdown-item v-on:click="detallesdelperfil()">Profile</b-dropdown-item>
                <b-dropdown-item v-on:click="logout()">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>   
</template>

<script>
export default {
  name: 'Menu',
  data: function(){
    return {
      username: localStorage.username
    }
  },
  methods:{
      logout(){
          localStorage.clear();
          this.$router.push('home')
          //TO DO
          //tendremos que devolverle al muro principal de tweets y en vez de mostrarle su nombre de usuario mostrar una opcion de inicio de sesión
      },
      detallesdelperfil(){
          this.$router.push('perfil') 
      },
      tweets(){
          this.$router.push('tweets') 
      },
      seguidores(){
          this.$router.push('seguidores')
      },
      seguidos(){
          this.$router.push('seguidos')
      }
  }
}
</script>




