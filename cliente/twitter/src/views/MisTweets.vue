<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h1 class="display-2" align="center">TUS TWEETS</h1>
            <br/>
            <button type="button" align="center" style="margin-left: 560px" class="btn btn-primary btn-lg" v-on:click="postearTweet()">Publicar tweet</button>
        </div>
        <div class="container" v-if="noTieneTweets == false">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Contenido</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tweet, index) in listaTweets" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{tweet.mensaje}} </td>
                        <td align="right">
                            <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesTweet(tweet._id)">Detalles del tweet</button>
                            <button type="button" class="btn btn-secondary" style="margin-left: 10px" v-on:click="editarTweet(tweet._id)">Editar tweet</button>
                            <button type="button" class="btn btn-danger" style="margin-left: 10px" v-on:click="borrarTweet(tweet._id, index)">Borrar tweet</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="alert alert-success" role="alert" v-if="borrado">
                Tweet eliminado!!
            </div>
            <b>Número de tweets: {{totalTweets}}</b>
        </div>
        <div class="container" v-else>
            <br/>
            <div class="alert alert-danger" role="alert">
                No tienes ningún tweet, postea!
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue';
import axios from 'axios';
export default{
    name: "Perfil", 
    data: function(){
        return {
            listaTweets: null,
            pagina: 1,
            totalTweets: 0,
            noTieneTweets: false,
            borrado: false
        }
    },
    components:{
        Header
    },
    mounted: function(){
        let direccion = "http://localhost:3000/twapi/usuarios/" + this.$store.state.idUsuario + "/tweets";
        axios.get(direccion)
            .then(result => {
                console.log(result)
                if(result.data.mensaje == 'Este usuario no tiene tweets'){
                    this.noTieneTweets = true;
                }
                else{
                    this.listaTweets = result.data.docs;
                    this.totalTweets = result.data.totalDocs;
                }
            }).catch((err) => {
                console.log(err)
            })
    },
    methods:{
        postearTweet(){
            this.$router.push('/nuevoPost');
        },
        detallesTweet(idTweet){
            this.$router.push('/tweets/' + idTweet);
        },
        editarTweet(idTweet){
            this.$router.push('/editarPost/' + idTweet)
        },
        borrarTweet(idTweet, index){
            let direccion = "http://localhost:3000/twapi/tweets/" + idTweet;
            axios.delete(direccion)
                .then(result => {
                    console.log(result)
                    if(result.status == 200){
                        this.borrado = true;
                        this.listaTweets.splice(index, 1);
                        this.totalTweets--;
                        if(this.totalTweets == 0){
                            this.noTieneTweets = true;
                        }
                    }
                    
                }).catch(err => {
                    console.log(err);
                    this.borrado = false;
                })
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>