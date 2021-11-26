<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#muro">TWITTER</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#muro">Muro principal</b-nav-item>
                <b-nav-item href="#tustweets">Mis tweets</b-nav-item>
                <b-nav-item href="#seguidores">Seguidores</b-nav-item>
                <b-nav-item href="#seguidos">Seguidos</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <em>{{username}}</em>
                </template>
                <b-dropdown-item href="#detallesdelperfil">Profile</b-dropdown-item>
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
      username: localStorage.username
    }
  },
  methods:{
      logout(){
          localStorage.clear();
          axios.post('http://localhost:3000/twapi/usuarios/logout')
          //TO DO
          //tendremos que devolverle al muro principal de tweets y en vez de mostrarle su nombre de usuario mostrar una opcion de inicio de sesión
      }
  }
}
</script>




