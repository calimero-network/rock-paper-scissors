<template>
  <q-page class="flex flex-center">
    <div
      class="row bg-grey-1 items-center justify-center"
      style="width: 900px; border: 1px solid #ababab; border-radius: 2px"
    >
      <play-game />
      <q-separator vertical />
      <div class="col">
        <leader-board />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import LeaderBoard from '../components/LeaderBoard.vue'
import PlayGame from '../components/PlayGame.vue'

defineOptions({
  name: 'IndexPage'
})
</script>
