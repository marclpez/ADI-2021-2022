<template>
    <div>
        <Header/>
        <br/>
        <h3 class="display-2" align="center">Detalles de {{nickname}}</h3>
        <div class="container" align="right" v-if="mostrarEditarPerfil" >
            <button type="button" class="btn btn-info btn-lg" style="margin: 10px" v-on:click="editarPerfil()">Editar perfil</button>
        </div>
        <div class="container" align="right" v-if="mostrarBotonDejarDeSeguir" >
            <button type="button" class="btn btn-danger btn-lg" style="margin: 10px" v-on:click="borrarSeguimiento()">Dejar de seguir</button>
        </div>
        <div class="container" align="right" v-if="mostrarBotonDeSeguir">
            <button type="button" class="btn btn-success btn-lg" style="margin: 10px" v-on:click="addSeguimiento()">Seguir</button>
        </div>
        <br/>
        <div class="container">
            <table class="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Nickname</th>
                    <th scope="col">Seguidores</th>
                    <th scope="col">Seguidos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{email}}</td>
                        <td>{{nickname}}</td>
                        <td>{{seguidores}}</td>
                        <td>{{seguidos}}</td>
                        <td align="right"><button type="button" v-if="!esElUsuarioLogueado" class="btn btn-dark" v-on:click="seguidoresYseguidos()">Más detalles</button></td>
                    </tr>
                </tbody>
            </table>
            <br>

            <br>
            <h5 class="display" align="center">Tweets:</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Contenido</th>
                        <th scope="col" align="center">Likes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tweet, index) in listaTweets" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{tweet.mensaje}} </td>
                        <td>{{tweet.likes.length}} </td>
                        <td align="right">
                            <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesTweet(tweet._id)">Detalles del tweet</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue';
import axios from 'axios';

export default{
    name: "DetallesUsuario",
    components:{
        Header
    },
    data: function(){
        return {
            listaTweets: null,
            seguidores: null,
            seguidos: null,
            mensajes: null,
            likes: null,
            nickname: null,
            password: null,
            email: null,
            error: false,
            ok: false,
            esElUsuarioLogueado: false,
            sigueAlUsuario: false,
            idSeguimiento: null
        }
    },
    mounted: function(){
        if(this.$store.state.idUsuario == this.$route.params.id){
            this.esElUsuarioLogueado = true;
        }
        axios.get('http://localhost:3000/twapi/usuarios/' + this.$route.params.id)
            .then(result => {
                console.log(result);
                this.id = result.data._id;
                this.nickname = result.data.nickname;
                this.email = result.data.email;
                this.seguidores = result.data.seguidores.length;
                this.seguidos = result.data.seguidos.length;
                this.ok = true;
            }).catch((err) => console.log(err));

        console.log(this.$route.params.id)
        axios.get("http://localhost:3000/twapi/usuarios/" + this.$route.params.id + "/tweets")
            .then(result => {
                console.log(result)
                if(result.data.mensaje == 'Este usuario no tiene tweets'){
                    this.noTieneTweets = true;
                }
                else{
                    this.listaTweets = result.data.docs;
                }
            }).catch((err) => {
                console.log(err)
            });
        
        axios.get("http://localhost:3000/twapi/usuarios/" + this.$store.state.idUsuario + "/seguidos")
            .then(result => {
                console.log(result)
                if(result.data.docs){
                    //buscamos si sigue al usuario del cual estamos visitando el perfil
                    var seguimiento = result.data.docs.find(item => {
                        return item.seguidor === this.$store.state.username && item.seguido === this.nickname;
                    })
                    console.log(seguimiento)
                    if(seguimiento){
                        this.sigueAlUsuario = true;
                        this.idSeguimiento = seguimiento._id;
                    }
                }
            }).catch((err) => {
                console.log(err)
            });
    },
    computed: {
        mostrarEditarPerfil(){
            return this.esElUsuarioLogueado;
        },
        mostrarBotonDejarDeSeguir(){
            return !this.esElUsuarioLogueado && this.sigueAlUsuario;
        },
        mostrarBotonDeSeguir(){
            return !this.esElUsuarioLogueado && !this.sigueAlUsuario;
        }
    },
    methods: {
        editarPerfil(){
            this.$router.push('/editarPerfil/' + this.$route.params.id)
        },
        addSeguimiento(){
            let json = {
                "seguido": this.nickname
            }
            axios.post("http://localhost:3000/twapi/seguimientos/", json)
                .then(result => {
                    console.log(result)
                    if(result.data.mensaje === 'Guardado el seguimiento'){
                        this.sigueAlUsuario = true;
                        this.idSeguimiento = result.data.seguimiento._id;
                    }
                }).catch((err) => {
                    console.log(err)
                }); 
        },
        borrarSeguimiento(){
            axios.delete("http://localhost:3000/twapi/seguimientos/" + this.idSeguimiento)
                .then(result => {
                    console.log(result)
                    if(result.data.mensaje === 'Seguimiento eliminado'){
                        this.sigueAlUsuario = false;
                        this.idSeguimiento = null;
                    }
                }).catch((err) => {
                    console.log(err)
                });             
        },
        detallesTweet(idTweet){
            this.$router.push('/tweets/' + idTweet);
        },
        seguidoresYseguidos(){
            this.$router.push('/seguidoresYseguidos/' + this.$route.params.id);
        }
    }
}
</script>