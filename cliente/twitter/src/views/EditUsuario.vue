<template>
    <div>
        <Header/>
        <br/>
        <div class="container">
            <h3><b>Editar perfil</b></h3>
            <p>Modifique los campos que desea actualizar e introduzca la nueva contraseña si desea modificar la que tiene</p>
            <br/>
            <form v-on:submit.prevent="editarPerfil">
                <label for="nickname">Nickname</label>
                <input type="text" id="nickname" class="form-control" style="padding: 10px; border-radius: 10px" name="nickname" placeholder="Escribe aquí el nickname" v-model="nickname" required>
                <br/>
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" style="padding: 10px; border-radius: 10px" name="email" placeholder="Escribe aquí el email" v-model="email" required>
                <br/>
                <label for="password">Password</label>
                <input type="password" id="password" class="form-control" style="padding: 10px; border-radius: 10px" name="password" placeholder="Introduzca su nueva password si desea actualizarla" v-model="password">
                <br/>
                <input align="center" type="submit" class="btn btn-primary btn-lg" style="margin-left: 560px" value="Editar perfil">
            </form>


        </div>
    </div>
</template>

<script>
import Header from '@/components/Menu.vue'
import axios from 'axios'

export default{
    name: 'editarUsuario',
    components: {
        Header
    },
    data: function(){
        return {
            idUsuario: null,
            nickname: '',
            password: '',
            email: ''
        }
    },
    mounted: function(){
        this.idUsuario = this.$route.params.id;
        axios.get('http://localhost:3000/twapi/usuarios/' + this.idUsuario)
            .then(result => {
                console.log(result)
                this.nickname = result.data.nickname;
                this.email = result.data.email
            }).catch((err) => console.log(err))
    },
    methods: {
        editarPerfil(){
            let json = {
                "nickname": this.nickname,
                "email": this.email
            }
            if(this.password){
                json = {
                    "nickname": this.nickname,
                    "email": this.email,
                    "password": this.password
                }
            }
            axios.put('http://localhost:3000/twapi/usuarios/' + this.idUsuario, json)
                .then(result => {
                console.log(result);
                if(result.data.mensaje == "Usuario actualizado"){
                    this.$store.commit('setUsername', this.nickname);
                    this.$store.commit('setEmail', this.email);
                    this.$router.push('/usuarios/' + this.idUsuario);
                }
                }).catch((err) => { 
                    console.log(err);
                    this.err = true; 
                })
        }
    }
}
</script>

<style scoped>

</style>