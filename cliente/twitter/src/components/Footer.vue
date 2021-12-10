<template>
    <!-- Footer -->
    <footer class="text-center text-white" style="background-color: #34A0E6;">
        <!-- Grid container -->
        <div class="container p-4 pb-0">
        <!-- Section: CTA -->
        <section class="">
            <p class="d-flex justify-content-center align-items-center">
            <span class="me-3">Register for free</span>
            <button type="button" class="btn btn-outline-light btn-rounded" v-on:click="registro()">
                Sign up!
            </button>
            </p>
        </section>
        <!-- Section: CTA -->
        </div>
        <!-- Grid container -->

        <!-- Copyright -->
        <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
        © 2021 Copyright:
        <a class="text-white" href="https://twitter.com/">Twitter.com</a>
        </div>
        <!-- Copyright -->
    </footer>
</template>

<script>
export default {
  name: 'Footer',
  methods:{
      registro(){
        this.$router.push('/registro');
    }
  }
}
</script>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
