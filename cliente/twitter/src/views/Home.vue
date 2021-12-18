<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3 align="left"> <b> Tweets posteados por los usuarios de nuestra aplicación: </b></h3>
        </div>
        <br/>
        <div class="container">
            <paginate ref="paginator" name = "listaTweets" :list = "listaTweets" :per = "5">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Autor</th>
                        <th scope="col" align="center">Contenido</th>
                        <th scope="col" align="center">Likes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tweet in paginated('listaTweets')" :key="tweet._id">
                        <td>{{tweet.autor}} </td>
                        <td>{{tweet.mensaje}} </td>
                        <td>{{tweet.likes.length}} </td>
                        <td align="right" v-if="logueado">
                            <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesTweet(tweet._id)">Info del tweet</button>
                            <button  v-if="tweet.autor != usuarioLogueado" type="button" class="btn btn-success" style="margin-left: 10px" v-on:click="detallesUsuario(tweet.autor)">Info del autor</button>
                            <button v-else type="button" class="btn btn-success" style="margin-left: 10px" v-on:click="detallesUsuario(tweet.autor)">Info de tu perfil</button>
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
        </div>
        <Footer v-if="!logueado"/>
    </div>   
</template>

<script>
import axios from 'axios';
import Header from '../components/Menu.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'Home',
  components:{
      Header, Footer
  },
  data: function(){
      return{
          listaTweets: [],
          usuarioLogueado: this.$store.state.username,
          logueado: this.$store.state.logueado,
          paginate: ['listaTweets']
      }  
  },
  mounted: function(){
    axios.get('http://localhost:3000/twapi/tweets/')
        .then(result => {
            console.log(result);
            this.listaTweets = result.data.docs;
        })
  },
  methods:{
      login(){
          this.$router.push('/login')
      },
      registro(){
          this.$router.push('/registro')
      },
      detallesTweet(idTweet){
          this.$router.push('/tweets/' + idTweet)
      },
      detallesUsuario(username){
          axios.get('http://localhost:3000/twapi/usuarios/nickname/' + username)
            .then(result => {
                console.log(result)
                var idUsuario = result.data._id;
                this.$router.push('/usuarios/' + idUsuario)
            }).catch(err => console.log(err))
      }
  }
}
</script>

<style >
html, body { 
  height:100%; 
  margin:0;
  padding:0;
}

.header{
    height: 50px;
    display: flex;
    justify-content: center;
    align-content: center;
}


.btn-circle.btn-xl {
    width: 150px;
            height: 100px;
            padding: 7px 10px;
            border-radius: 50px;
            font-size: 20px;
            text-align: center;
}

#container{
    margin: 150px auto;
    width: 600px;
}
#cuerpo{
    display: flex;
    justify-content: center;
    align-content: center;
}

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

</style>




