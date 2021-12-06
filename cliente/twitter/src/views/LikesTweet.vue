<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Los usuarios que le han dado like al tweet son: </b></h3>
        </div>
        <br/>
        <div class="container" v-if="noTieneLikes == false">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="like in listaLikes" :key="like._id">
                        <td>{{like.usuario}}</td>
                        <td align="right" v-if="like.usuario != usuarioLogueado">
                            <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesUsuario(like.usuario)">Detalles del usuario</button>
                        </td>
                        <td align="right" v-else>
                            <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesUsuario(like.usuario)">Tu perfil</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <b>Número de likes: {{totalLikes}}</b>
        </div>
        <div class="container" v-else>
            <div class="alert alert-danger" role="alert">
                Este tweet no tiene likes
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue';
import axios from 'axios';

//mostrar boton para ver el perfil del usuario
export default{
    name: "LikesTweet",
    data: function(){
        return {
            usuarioLogueado: this.$store.state.username,
            idTweet: null,
            pagina: 1,
            totalLikes: 0,
            listaLikes: null,
            noTieneLikes: false
        }
    },
    components:{
        Header
    },
    mounted: function(){
        this.idTweet = this.$route.params.id;
        axios.get('http://localhost:3000/twapi/tweets/' + this.idTweet + '/likes?page=' + this.pagina)
            .then(result => {
                console.log(result)
                if(result.data.mensaje == 'Este tweet no tiene likes'){
                    this.noTieneLikes = true;
                }
                else{
                    this.listaLikes = result.data.likes.docs;
                    this.totalLikes = result.data.likes.totalDocs;
                }
            })
    },
    methods:{
        detallesUsuario(nicknameUsuario){
            let direccion = "http://localhost:3000/twapi/usuarios/nickname/" + nicknameUsuario;
            axios.get(direccion)
                .then(result => {
                    console.log(result)
                    var idUsuario = result.data._id;
                    this.$router.push('/usuarios/' + idUsuario)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }


}
</script>

<style scoped>
</style>
