<template>
    <div>
        <Header/>
        <br/>
        <h3 class="display-2" align="center">Detalles de {{nickname}}</h3>
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
                    </tr>
                </tbody>
            </table>
            <br>
            <br>
            <div class="container" align="center">
                <button type="button" class="btn btn-info" v-if="mostrar === false" style="margin: 10px" v-on:click="mostrarTweets()">Mostrar Tweets</button>
            </div>
            <h5 class="display" v-show="mostrar" align="center">Tweets:</h5>
            <table class="table" v-show="mostrar">
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
            id: null,
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
            mostrar: false
        }
    },
    mounted: function(){
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
    },
    methods:{
        mostrarTweets(){
            axios.get("http://localhost:3000/twapi/usuarios/" + this.id + "/tweets")
                .then(result => {
                    console.log(result)
                    if(result.data.mensaje == 'Este usuario no tiene tweets'){
                        this.noTieneTweets = true;
                    }
                    else{
                        this.listaTweets = result.data.docs;
                    }
                    this.mostrar = true;
                }).catch((err) => {
                    console.log(err)
                });
        }
    }

}
</script>