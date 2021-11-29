<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Seguidores: </b></h3>
            <br/>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Tweet</th>
                        <th scope="col" align="center">Usuario</th>
                        <th scope="col" align="center">Mensaje</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tweet in tweets" :key="tweet._id">
                        <td>{{tweet._id}}
                        <td>{{tweet.autor}}</td>
                        <td>{{tweet.mensaje}}</td>
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
    name: "Tweets",
    data: function(){
        return {
            tweets: null,
            pagina: 1,
        }
    },
    components:{
        Header
    },
    mounted: function(){
        axios.get('http://localhost:3000/twapi/tweets?page=' + this.pagina)
            .then(result => {
                console.log(result)
                this.tweets = result.data.docs;
            })
    }


}
</script>

<style scoped>
</style>
