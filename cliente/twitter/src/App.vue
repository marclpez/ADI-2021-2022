<template>
  <div id="app">
    <transition mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<style scoped>
  .v-enter-active, .v-leave-active {
    transition: opacity .8s;
  }
  .v-enter, .v-leave-to {
    opacity: 0;
  }
</style>
