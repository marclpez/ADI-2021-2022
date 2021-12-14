<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h1 class="display-2" align="center"><b>TUS TWEETS</b></h1>
            <br/>
            <button type="button" align="center" style="margin-left: 560px" class="btn btn-primary btn-lg" v-on:click="postearTweet()">Publicar tweet</button>
        </div>
        <div class="container" v-if="noTieneTweets == false">
            <paginate ref="paginator" name = "listaTweets" :list = "listaTweets" :per = "2">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Contenido</th>
                    </tr>
                </thead>

                
                <tbody name="tweet-table" is="transition-group">
                    
                        <tr class="tweet-table-item" v-for="(tweet, index) in paginated('listaTweets')" :key="index">
                            <td>{{index+1}}</td>
                            <td>{{tweet.mensaje}} </td>
                            <td align="right">
                                <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesTweet(tweet._id)">Detalles del tweet</button>
                                <button type="button" class="btn btn-secondary" style="margin-left: 10px" v-on:click="editarTweet(tweet._id)">Editar tweet</button>
                                <button type="button"  @click="show = !show" class="btn btn-danger" style="margin-left: 10px" v-on:click="borrarTweet(tweet._id, index)">Borrar tweet</button>
                            </td>
                        </tr>
                </tbody>
            </table>
            </paginate>
                <paginate-links
                    for="listaTweets"
                    :show-step-links="true"
                    :simple="{
                        prev: 'Anterior',next: 'Siguiente'  
                    }">
                </paginate-links>
            <div class="alert alert-success" role="alert" v-if="borrado">
                Tweet eliminado!!
            </div>
            <!-- <b>Número de tweets: {{totalTweets}}</b> -->
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
            borrado: false,
            paginate:['listaTweets']
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

<style>

 .paginate-links{
    width:100%;
    list-style: none;
    text-align: center;
}

.paginate-links li {
    display: inline;
    background-color: black;
    color:white;
    padding:0.5rem;
    margin-left:0.3rem;
    margin-right: 0.3rem;
    cursor:pointer;
    border-radius: 3px;
}

.paginate-result{
    width: 100%;
    text-align:center;
    margin-bottom: 1rem;
}


.tweet-list-item {
  transition: all 1s;
}
.tweet-list-enter,
.tweet-list-leave-to {
  max-height: 0px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  overflow: hidden;
}
.tweet-list-enter-to,
.tweet-list-leave {
  max-height: 80px;
}

.tweet-table-item {
  transition: all 1s;
}
.tweet-table-item > * {
  transition: all 1s;
  overflow: hidden;
}
.tweet-table-enter,
.tweet-table-leave-to {
  line-height: 0;
}
.tweet-table-enter > *,
.tweet-table-leave-to > * {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

</style>