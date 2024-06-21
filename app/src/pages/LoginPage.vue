<script setup>
import NearLogin from '../components/NearLogin.vue'
</script>

<template>
  <main>
    <NearLogin :appId="$route.query.appId" :rpcBaseUrl="$route.query.rpcUrl" />
  </main>
</template>
