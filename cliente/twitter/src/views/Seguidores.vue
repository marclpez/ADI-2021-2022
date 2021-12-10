<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Te sigue: </b></h3>
            <br/>
            <table class="table" v-if="noTieneSeguidores == false">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(seguimiento, index) in listaSeguimientos" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{seguimiento.seguidor}}</td>
                        <td align="right">
                            <button type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguimiento.seguidor)">Visitar perfil</button>
                            <button v-if="esReciproco(seguimiento)" type="button" class="btn btn-success" style="margin: 10px" v-on:click="borrarSeguimiento(seguimiento._id)">Dejar de seguir</button>
                            <button v-else type="button" class="btn btn-success" style="margin: 10px" v-on:click="addSeguimiento(seguimiento.seguidor)">Seguir</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="alert alert-danger" role="alert" v-else>
                No te sigue nadie todavía
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue';
import axios from 'axios';

export default{
    name: "Seguidores",
    data: function(){
        return {
            listaSeguimientos: null,
            noTieneSeguidores: false
        }
    },
    components:{
        Header
    },
    mounted: function(){    
        let direccion = "http://localhost:3000/twapi/usuarios/" + this.$store.state.idUsuario + "/seguidores";
        axios.get(direccion)
            .then(result => {
                console.log(result)
                this.listaSeguimientos = result.data.docs;
                if(result.data.mensaje == 'El usuario no tiene seguidores'){
                    this.noTieneSeguidores = true;
                }
            }).catch((err) => {
                console.log(err)
            })
        this.esReciproco();
    },
    computed: {

    },
    methods: {
        detallesUsuario(nicknameUsuario){
            let direccion = "http://localhost:3000/twapi/usuarios/nickname/" + nicknameUsuario;
            axios.get(direccion)
                .then(result => {
                    console.log(result)
                    var idUsuario = result.data._id;
                    this.$router.push('/usuarios/' + idUsuario)
                }).catch((err) => {
                    console.log(err)
                })
        },
        addSeguimiento(seguido){
            let json = {
                "seguido": seguido
            }
            axios.post("http://localhost:3000/twapi/seguimientos/", json)
                .then(result => {
                    console.log(result)
                }).catch((err) => {
                    console.log(err)
                }); 
        },
        borrarSeguimiento(id){
            axios.delete("http://localhost:3000/twapi/seguimientos/" + id)
                .then(result => {
                    console.log(result)
                }).catch((err) => {
                    console.log(err)
                });  
        },
        esReciproco(seguimiento){
            let direccion = "http://localhost:3000/twapi/usuarios/" + this.$store.state.idUsuario + "/seguidos";
            var reciproco = false;
            axios.get(direccion)
                .then(result => {
                    console.log(result)
                    if(result.data.docs){
                        //buscamos si sigue al usuario del cual estamos visitando el perfil
                        var followback = result.data.docs.find(item => {
                            return item.seguidor === this.$store.state.username && item.seguido === seguimiento.seguidor;
                        })
                        console.log(followback)
                        if(followback){
                            reciproco = true;
                        }
                    }
                })
            return reciproco;
        }
    }

}
</script>

<style scoped>
</style>