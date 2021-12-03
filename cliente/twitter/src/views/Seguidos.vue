<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Sigues a: </b></h3>
            <br/>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in listaSeguidos" :key="usuario._id">
                        <td>{{usuario._id}}</td>
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
            listaSeguidos: null,
            noSigueAnadie: false
        }
    },
    components:{
        Header
    },
    mounted: function(){    
        let direccion = "http://localhost:3000/twapi/usuarios/" + this.$store.state.idUsuario + "/seguidos";
        axios.get(direccion)
            .then(result => {
                console.log(result)
                this.listaSeguidos = result.data.docs;
                if(result.data.totalDocs == 0){
                    this.noSigueAnadie = true;
                }
            }).catch((err) => {
                console.log(err)
            })
    }


}
</script>

<style scoped>
</style>
