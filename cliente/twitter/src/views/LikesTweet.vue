<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Los usuarios que le han dado like al tweet son: </b></h3>
            <br/>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="like in listaLikes" :key="like._id">
                        <td>{{like.usuario}}</td>
                        <td align="right">
                            <button type="button" class="btn btn-info" style="margin-left: 10px" v-on:click="detallesUsuario(like.usuario)">Detalles del usuario</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <b>Número de likes: {{totalLikes}}</b>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue';
import axios from 'axios';

//mostrar boton para ver el perfil del usuario
export default{
    name: "LikesTweet",
    data: function(){
        return {
            idTweet: null,
            pagina: 1,
            totalLikes: 0,
            listaLikes: null,
        }
    },
    components:{
        Header
    },
    mounted: function(){
        this.idTweet = this.$route.params.id;
        axios.get('http://localhost:3000/twapi/tweets/' + this.idTweet + '/likes?page=' + this.pagina)
            .then(result => {
                console.log(result)
                this.listaLikes = result.data.likes.docs;
                this.totalLikes = result.data.likes.totalDocs;
            })
    },
    methods:{
        detallesUsuario(id){
            //TO DO
            console.log(id);
        }
    }


}
</script>

<style scoped>
</style>
