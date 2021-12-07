<template>
    <div>
        <Header/>
        <br/>
        <h1 class="display-2" align="center">DETALLES DEL TWEET</h1>
        <br/>
        <div class="container">
            <table class="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">Autor</th>
                    <th scope="col">Mensaje</th>
                    <th scope="col">Likes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{autor}}</td>
                        <td>{{mensaje}}</td>
                        <td>{{likes}}</td>
                    </tr>
                </tbody>
            </table>

            <div class="alert alert-success" role="alert" v-if="okDado">
                Like registrado!!
            </div>


            <div class="alert alert-danger" role="alert" v-if="okQuitado">
                Like eliminado!!
            </div>

            <div class="container" align="center">
                <button v-if="yaLeHaDadoLike" type="button" class="btn btn-danger" style="margin: 10px" v-on:click="borrarLike()">Quitar like</button>
                <button v-else type="button" class="btn btn-danger" style="margin: 10px" v-on:click="nuevoLike(idTweet)">Dar like</button>
                <button type="button" class="btn btn-info" style="margin: 10px" v-on:click="listaLikes(idTweet)">¿Quién le ha dado like al tweet?</button>
                <button type="button" class="btn btn-dark" style="margin: 10px" v-on:click="volver()">Volver al muro</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue';
import axios from 'axios';

export default{
    name: "DetallesTweet",
    components:{
        Header
    },
    data: function(){
        return {
            idTweet: null,
            autor: null,
            mensaje: null,
            likes: null,
            okDado: false,
            okQuitado: false,
            error: false,
            yaLeHaDadoLike: false,
            idLike: null
        }
    },
    mounted: function(){
        this.idTweet = this.$route.params.id;
        axios.get('http://localhost:3000/twapi/tweets/' + this.idTweet)
            .then(result => {
                console.log(result)
                this.autor = result.data.autor.nickname;
                this.mensaje = result.data.mensaje;
                this.likes = result.data.likes.length;
            }).catch((err) => console.log(err))
        
        axios.get('http://localhost:3000/twapi/tweets/' + this.idTweet + '/likes')
            .then(result => {
                console.log(result)
                var likeUsuario = result.data.likes.docs.find(x => x.usuario === this.$store.state.username);
                console.log(likeUsuario)
                if(likeUsuario){
                    this.yaLeHaDadoLike = true;
                    this.idLike = likeUsuario._id;
                }
            }).catch((err) => console.log(err))
    },
    methods: {
        nuevoLike(id){
            let json = {
                "tweet": id
            }
            axios.post('http://localhost:3000/twapi/likes', json)
                .then(result => {
                    console.log(result);
                    if(result.status == 201){
                        this.likes++;
                        this.okQuitado = false;
                        this.okDado = true;
                        this.yaLeHaDadoLike = true;
                        this.idLike = result.data.like._id
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        borrarLike(){
            axios.delete('http://localhost:3000/twapi/likes/' + this.idLike)
                .then(result => {
                    console.log(result);
                    if(result.data.mensaje == 'Like eliminado'){
                        this.yaLeHaDadoLike = false;
                        this.likes--;
                        this.okDado = false;
                        this.okQuitado = true;
                    }
                })
        },
        listaLikes(id){
            this.$router.push('/tweets/' + id + '/likes');
        },
        volver(){
            this.$router.push("/home")
        }
    }
}
</script>
