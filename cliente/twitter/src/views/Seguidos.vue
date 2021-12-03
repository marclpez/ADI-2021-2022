<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Sigues a: </b></h3>
            <br/>
            <table class="table" v-if="noSigueAnadie == false">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(seguimiento, index) in listaSeguimientos" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{seguimiento.seguido}}</td>
                        <td align="right">
                            <button type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguimiento.seguido)">Visitar perfil</button>
                            <button type="button" class="btn btn-danger" style="margin-left: 10px" v-on:click="borrarSeguimiento(seguimiento._id, index)">Dejar de seguir</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="alert alert-danger" role="alert" v-else>
                No sigues a nadie todavía
            </div>
            <div class="alert alert-danger" role="alert" v-if="seguimientoEliminado">
                Ya no sigues a ese usuario
            </div>
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
            listaSeguimientos: null,
            noSigueAnadie: false,
            seguimientoEliminado: false
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
                this.listaSeguimientos = result.data.docs;
                if(result.data.mensaje == 'El usuario no sigue a nadie'){
                    this.noSigueAnadie = true;
                }
            }).catch((err) => {
                console.log(err)
            })
    },
    methods: {
        borrarSeguimiento(idSeguimiento, index){
            let direccion = "http://localhost:3000/twapi/seguimientos/" + idSeguimiento;
            axios.delete(direccion)
                .then(result => {
                    console.log(result)
                    if(result.data.mensaje == 'Seguimiento eliminado'){
                        this.seguimientoEliminado = true;
                        this.listaSeguimientos.splice(index, 1)
                    }
                }).catch((err) => {
                    console.log(err)
                })
        },
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
        }
    }


}
</script>

<style scoped>
</style>
