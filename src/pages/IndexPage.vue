<template>
  <q-page class="flex flex-center">
    <div
      class="row bg-grey-1"
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
import LeaderBoard from "src/components/LeaderBoard.vue";
import PlayGame from "src/components/PlayGame.vue";
import { ref } from "vue";
const model = ref("rock");
defineOptions({
  name: "IndexPage",
});
</script>
