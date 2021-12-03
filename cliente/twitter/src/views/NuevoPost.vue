<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3><b>Nuevo tweet</b></h3>
            <form v-on:submit.prevent="postear">
                <input type="text" id="tweet" class="form-control" style="padding: 10px; border-radius: 10px" name="tweet" placeholder="Escribe aquí el tweet" v-model="contenido">
                <br/>
                <input align="center" type="submit" class="btn btn-primary btn-lg" style="margin-left: 560px" value="Postear">
            </form>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue'
import axios from 'axios'

export default{
    name: 'nuevoPost',
    data: function(){
        return {
            contenido: ''
        }
    },
    components: {
        Header
    },
    methods: {
        postear(){
            let json = {
                "mensaje": this.contenido
            }
            axios.post('http://localhost:3000/twapi/tweets', json)
                .then(result => {
                console.log(result);
                if(result.data.mensaje == "Guardado el tweet"){
                    this.$router.push('/misTweets');
                }
                }).catch((err) => { console.log(err)
                })
        }
    }
}
</script>

<style scoped>

</style>