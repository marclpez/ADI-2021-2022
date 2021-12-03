<template>
    <div>
        
        <b-navbar toggleable="lg" type="dark" variant="info">
            <img src="../assets/logo.png" width="50px" height="50px">
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav v-if="logueado">
              <b-navbar-nav>
                  <b-nav-item v-on:click="mostrarHome()">TWITTER</b-nav-item>
                  <b-nav-item v-on:click="mostrarMuro()">Muro principal</b-nav-item>
                  <b-nav-item href="#tustweets">Mis tweets</b-nav-item>
                  <b-nav-item v-on:click="seguidores()">Seguidores</b-nav-item>
                  <b-nav-item v-on:click="seguidos()">Seguidos</b-nav-item>
              </b-navbar-nav>

              <!-- Right aligned nav items -->
              <b-navbar-nav class="ms-auto" style="margin:13px">
                  <b-nav-item-dropdown>
                  <!-- Using 'button-content' slot -->
                  <template #button-content>
                      <em style="padding: 40px">{{username}}</em>
                  </template>
                  <b-dropdown-item v-on:click="detallesdelperfil()">Profile</b-dropdown-item>
                  <b-dropdown-item v-on:click="logout()">Sign Out</b-dropdown-item>
                  </b-nav-item-dropdown>
              </b-navbar-nav>
            </b-collapse>

            <b-collapse id="nav-collapse" is-nav v-else>
              <b-navbar-nav>
                  <b-nav-item v-on:click="login()">Login</b-nav-item>
                  <b-nav-item v-on:click="registro()">Registro</b-nav-item>
              </b-navbar-nav>
            </b-collapse>

        </b-navbar>
    </div>   
</template>

<script>
import axios from 'axios';

export default {
  name: 'Menu',
  data: function(){
    return {
      username: this.$store.state.username,
      logueado: this.$store.state.logueado
    }
  },
  methods:{
      login(){
        this.$router.push('/login');
      },
      registro(){
        this.$router.push('/registro');
      },
      logout(){
        axios.post('http://localhost:3000/twapi/usuarios/logout')
        .then(result => {
          console.log(result);
          if(result.data.mensaje == "Sesión cerrada"){
            localStorage.removeItem('token')
            this.$store.commit('logout');
            this.$router.push('/login');
          }
        }).catch((err) => {
          console.log(err)
        })
          this.$router.push('/')
      },
      detallesdelperfil(){
          if(this.$route.path !== '/perfil'){
            this.$router.push('/perfil')
          }
      },
      mostrarHome(){
          if(this.$route.path !== '/home'){
            this.$router.push('/home')
          }
      },
      mostrarMuro(){
          if(this.$route.path !== '/tweets'){
            this.$router.push('/tweets')
          }
      },
      seguidores(){
          if(this.$route.path !== '/seguidores'){
            this.$router.push('/seguidores')
          }
      },
      seguidos(){
          if(this.$route.path !== '/seguidos'){
            this.$router.push('/seguidos')
          }
      }
  }
}
</script>




