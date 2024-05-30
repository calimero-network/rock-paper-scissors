<template>
  <q-page class="flex flex-center">
    <div class="column">
      <div
        class="row bg-grey-1 items-center justify-center"
        style="width: 900px; border: 1px solid #ababab; border-radius: 2px"
      >
        <play-game v-if="isAuthenticated()" />
        <div v-else class="col row justify-center">
          <q-btn dense no-caps to="/login" color="orange-8" size="xl">Login</q-btn>
        </div>
        <q-separator vertical />
        <div class="col">
          <leader-board />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import LeaderBoard from '../components/LeaderBoard.vue'
import PlayGame from '../components/PlayGame.vue'
import { isAuthenticated } from '../auth'

defineOptions({
  name: 'IndexPage'
})
</script>
