<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Sigues a: </b></h3>
            <br/>
        </div>
        <div class="container" v-if="noSigueAnadie == false">    
            <paginate ref="paginator" name = "listaSeguimientos" :list = "listaSeguimientos" :per = "2">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(seguimiento, index) in paginated('listaSeguimientos')" :key="index" class="animated" transition="bounce">
                        <td>{{index+1}}</td>
                        <td>{{seguimiento.seguido}}</td>
                        <td align="right">
                            <button type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguimiento.seguido)">Visitar perfil</button>
                            <button type="button" class="btn btn-danger" style="margin-left: 10px" v-on:click="borrarSeguimiento(seguimiento._id, index)">Dejar de seguir</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <div class="alert alert-danger" role="alert" v-if="seguimientoEliminado && listaSeguimientos.length >= 1">
                Ya no sigues a ese usuario
            </div>
            </paginate>
            <paginate-links
                for="listaSeguimientos"
                :show-step-links="true"
                :simple="{
                    prev: 'Anterior',next: 'Siguiente'  
                }">
            </paginate-links>
        </div>
        <div class="container" v-else>
            <div class="alert alert-danger" role="alert">
                No sigues a nadie todavía
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
            listaSeguimientos: [],
            noSigueAnadie: false,
            seguimientoEliminado: false,
            paginate: ['listaSeguimientos']
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
                        this.listaSeguimientos.splice(index, 1)
                        this.seguimientoEliminado = true
                        if(this.listaSeguimientos.length == 0){
                            this.noSigueAnadie = true;
                        }
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

<style >

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
