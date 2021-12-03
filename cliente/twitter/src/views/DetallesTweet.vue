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

            <div class="alert alert-success" role="alert" v-if="ok">
                Like registrado!!
            </div>
            <!-- Error like -->
            <div class="alert alert-danger" role="alert" v-if="error">
                Ya le has dado like al tweet
            </div>

            <div class="container" align="center">
                <button type="button" class="btn btn-danger" style="margin: 10px" v-on:click="nuevoLike(idTweet)">Like</button>
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
            ok: false,
            error: false
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
                        this.ok = true;
                    }
                    else if(result.data.mensaje == 'Ya le has dado like a este tweet'){
                        this.ok = false;
                        this.error = true;
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.ok = false; //por si se vuelve a dar a like al tweet que no se quede el mensaje anterior en la pagina
                    this.error = true;
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
