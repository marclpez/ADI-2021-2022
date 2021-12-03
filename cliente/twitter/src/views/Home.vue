<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3 align="left"> <b> Tweets posteados por los usuarios de nuestra aplicación: </b></h3>
        </div>
        <br/>
        <div class="container">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Autor</th>
                        <th scope="col" align="center">Contenido</th>
                        <th scope="col" align="center">Likes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tweet in listaTweets" :key="tweet._id">
                        <td>{{tweet.autor}} </td>
                        <td>{{tweet.mensaje}} </td>
                        <td>{{tweet.likes.length}} </td>
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
  name: 'Home',
  components:{
      Header
  },
  data: function(){
      return{
          listaTweets: null
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
      }
  }
}
</script>

<style scoped>
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

</style>




