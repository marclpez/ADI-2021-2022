<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Te sigue: </b></h3>
            <br/>
        </div>
        <div class="container" v-if="noTieneSeguidores == false">
            <paginate ref="paginator" name = "listaSeguimientos" :list = "listaSeguimientos" :per = "2">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(seguimiento, index) in paginated('listaSeguimientos')" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{seguimiento.seguidor}}</td>
                        <td align="right">
                            <button type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguimiento.seguidor)">Visitar perfil</button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
            listaSeguimientos: [],
            noTieneSeguidores: false,
            paginate:['listaSeguimientos']
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