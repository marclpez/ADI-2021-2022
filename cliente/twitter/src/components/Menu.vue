<template>
    <div>
        
        <b-navbar toggleable="lg" type="dark" variant="info">
            <img src="../assets/logo.png" width="50px" height="50px">
            <b-navbar-brand href="#">TWITTER</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#">Muro principal</b-nav-item>
                <b-nav-item href="#tustweets">Mis tweets</b-nav-item>
                <b-nav-item v-on:click="seguidores()">Seguidores</b-nav-item>
                <b-nav-item v-on:click="seguidos()">Seguidos</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <em>{{$store.state.username}}</em>
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
import axios from 'axios';

export default {
  name: 'Menu',
  data: function(){
    return {
      username: this.$store.state.username
    }
  },
  methods:{
      logout(){
        axios.post('http://localhost:3000/twapi/usuarios/logout')
        .then(result => {
          console.log(result);
          if(result.data.mensaje == "Sesión cerrada"){
            this.$router.push('/home');
          }
        }).catch((err) => {
          console.log(err)
        })
          this.$router.push('/')
      },
      detallesdelperfil(){
          this.$router.push('perfil') 
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




