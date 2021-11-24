<template>
  <div class="login">
    <h1 class="title">Login</h1>
    <form action class="form" @submit.prevent="login">
      <label class="form-label" for="#email">Email</label>
      <input
        v-model="email"
        class="form-input"
        type="email"
        id="email"
        required
        placeholder="Email"
      >
      <br>
      <label class="form-label" for="#contraseña">Contraseña</label>
      <input
        v-model="contraseña"
        class="form-input"
        type="password"
        id="comntraseña"
        required
        placeholder="Contraseña"
      >
      <br>
      <input class="form-submit" type="submit" value="Login">
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>