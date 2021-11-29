<template>
    <div>
        <div class="header">
            <h1>Twitter</h1>
        </div>
        <div id="cuerpo">
            <button v-on:click="login()" class="btn btn-primary btn-circle btn-xl">Login</button>
            <img src="../assets/logo.png" width="650px" height="650px">
            <button v-on:click="registro()" class="btn btn-primary btn-circle btn-xl" >Registro</button>
        </div>
        

    </div>   
</template>

<script>
export default {
  name: 'Home',
  data: function(){
  },
  methods:{
      login(){
          this.$router.push('login')
      },
      logout(){
          this.$router.push('registro')
      }
  }
}
</script>

<style scoped>
html, body { 
  height:100%; 
  margin:0;
  padding:0;
}

.header{
    height: 50px;
    display: flex;
    justify-content: center;
    align-content: center;
}


.btn-circle.btn-xl {
    width: 150px;
            height: 100px;
            padding: 7px 10px;
            border-radius: 50px;
            font-size: 20px;
            text-align: center;
}


#cuerpo{
    display: flex;
    justify-content: center;
    align-content: center;
}

</style>




