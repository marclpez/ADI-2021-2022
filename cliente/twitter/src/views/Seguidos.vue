<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Tweets de tus seguidos: </b></h3>
            <br/>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usu in usuarios" :key="usu._id">
                        <td>{{usu._id}}</td>
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
    name: "Seguidos",
    data: function(){
        return {
            usuario: localStorage.username,
            usuarios: null
        }
    },
    components:{
        Header
    },
    mounted: function(){
        this.idTweet = this.$route.params.id;
        axios.get('http://localhost:3000/twapi/usuarios/' + this.usuario + '/seguidores')
            .then(result => {
                this.usuarios = result.data.docs._id;
            })
    }


}
</script>

<style scoped>
</style>
