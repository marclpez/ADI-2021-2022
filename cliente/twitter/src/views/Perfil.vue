<template>
    <div>
        <Header/>
        <br/>
        <h1 class="display-2" align="center">TUS TWEETS</h1>
        <div class="container">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Contenido</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tweet in listaTweets" :key="tweet._id">
                        <td>{{tweet.mensaje}} </td>
                        <td align="right">
                            <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesTweet(tweet._id)">Detalles del tweet</button>
                            <button type="button" class="btn btn-danger" style="margin-left: 10px" v-on:click="borrarTweet(tweet._id)">Borrar tweet</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="alert alert-success" role="alert" v-if="borrado">
                Tweet eliminado!!
            </div>
            <div class="alert alert-danger" role="alert" v-if="error_msg">
                {{error_msg}}
            </div>
            <b>Número de tweets: {{totalTweets}}</b>
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
            borrado: false,
            error_msg: ""
        }
    },
    components:{
        Header
    },
    mounted: function(){
        let direccion = "http://localhost:3000/twapi/usuarios/" + this.$store.state.idUser + "/tweets?page=" + this.pagina;
        axios.get(direccion)
            .then(result => {
                console.log(result)
                this.listaTweets = result.data.docs;
                this.totalTweets = result.data.totalDocs;
            }).catch((err) => {
                console.log(err)
            })
    },
    methods:{
        detallesTweet(idTweet){
            this.$router.push('/tweets/' + idTweet);
        },
        borrarTweet(idTweet){
            let direccion = "http://localhost:3000/twapi/tweets/" + idTweet;
            axios.delete(direccion)
                .then(result => {
                    console.log(result)
                    if(result.status == 200){
                        this.borrado = true;
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