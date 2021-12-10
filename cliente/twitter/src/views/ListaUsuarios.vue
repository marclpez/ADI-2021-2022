<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Usuarios que usan esta aplicación: </b></h3>
            <br/>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(usuario, index) in listaUsuarios" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{usuario.nickname}}</td>
                        <td align="right">
                            <button v-if="usuario.nickname != usuarioLogueado" type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(usuario._id)">Visitar perfil</button>
                            <button v-else type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(usuario._id)">Tu perfil</button>
                        </td>
                    </tr>
                </tbody>
            </table>            
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from '../components/Menu.vue'
export default {
  name: 'ListaUsuarios',
  components:{
      Header
  },
  data: function(){
      return{
          listaUsuarios: null,
          usuarioLogueado: this.$store.state.username,
      }  
  },
  mounted: function(){
    axios.get('http://localhost:3000/twapi/usuarios/')
        .then(result => {
            console.log(result);
            this.listaUsuarios = result.data.docs;
        })
  },
  methods:{
      detallesUsuario(idUsuario){
        this.$router.push('/usuarios/' + idUsuario);
      }
  }
}
</script>

<style scoped>

</style>