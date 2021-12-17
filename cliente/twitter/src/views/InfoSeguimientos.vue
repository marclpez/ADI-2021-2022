<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3> <b>Seguidores de {{nickname}}: </b></h3>
            <br/>
            <table class="table" v-if="!noTieneSeguidores">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(seguidor, index) in listaSeguidores" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{seguidor}}</td>
                        <td align="right">
                            <button v-if="seguidor != usuarioLogueado" type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguidor)">Visitar perfil</button>
                            <button v-else type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguidor)">Tu perfil</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="alert alert-danger" role="alert" v-if="noTieneSeguidores">
                No le sigue nadie todavía
            </div>
            <h3> <b>Seguidos de {{nickname}}: </b></h3>
            <br/>
            <table class="table" v-if="!noSigueAnadie">
                <thead>
                    <tr>
                        <th scope="col" align="center">#</th>
                        <th scope="col" align="center">Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(seguido, index) in listaSeguidos" :key="index" class="animated" transition="bounce">
                        <td>{{index+1}}</td>
                        <td>{{seguido}}</td>
                        <td align="right">
                            <button v-if="seguido != usuarioLogueado" type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguido)">Visitar perfil</button>
                            <button v-else type="button" class="btn btn-primary" style="margin-left: 10px" v-on:click="detallesUsuario(seguido)">Tu perfil</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="alert alert-danger" role="alert" v-if="noSigueAnadie">
                No sigue a nadie todavía
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue';
import axios from 'axios';

export default{
    name: "infoSeguimientos",
    data: function(){
        return {
            usuarioLogueado: this.$store.state.username,
            nickname: '',
            listaSeguidores: null,
            listaSeguidos: null,
            noTieneSeguidores: false,
            noSigueAnadie: false
        }
    },
    components:{
        Header
    },
    mounted: function(){    
        let direccion = "http://localhost:3000/twapi/usuarios/" + this.$route.params.id;
        axios.get(direccion)
            .then(result => {
                console.log(result);
                this.nickname = result.data.nickname;
                this.listaSeguidores = result.data.seguidores;
                this.listaSeguidos = result.data.seguidos;
                if(this.listaSeguidores.length === 0){
                    this.noTieneSeguidores = true;
                }
                if(this.listaSeguidos.length === 0){
                    this.noSigueAnadie = true;
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
        }
    }
}
</script>

<style scoped>

</style>