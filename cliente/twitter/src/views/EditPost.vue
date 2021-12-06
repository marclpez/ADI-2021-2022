<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3><b>Editar tweet</b></h3>
            <form v-on:submit.prevent="editarPost">
                <input type="text" id="tweet" class="form-control" style="padding: 10px; border-radius: 10px" name="tweet" placeholder="Escribe aquí el tweet" v-model="contenido">
                <br/>
                <input align="center" type="submit" class="btn btn-primary btn-lg" style="margin-left: 560px" value="Editar tweet">
            </form>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue'
import axios from 'axios'

export default{
    name: 'editarPost',
    components: {
        Header
    },
    data: function(){
        return {
            idTweet: null,
            contenido: ''
        }
    },
    mounted: function(){
        this.idTweet = this.$route.params.id;
        axios.get('http://localhost:3000/twapi/tweets/' + this.idTweet)
            .then(result => {
                console.log(result)
                this.contenido = result.data.mensaje;
            }).catch((err) => console.log(err))
    },
    methods: {
        editarPost(){
            let json = {
                "mensaje": this.contenido
            }
            axios.put('http://localhost:3000/twapi/tweets/' + this.idTweet, json)
                .then(result => {
                console.log(result);
                if(result.data.mensaje == "Tweet actualizado"){
                    this.$router.push('/misTweets');
                }
                }).catch((err) => { console.log(err) })
        }
    }
}
</script>

<style scoped>

</style>