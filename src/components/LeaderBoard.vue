<template>
  <div class="q-pa-md">
    <q-table
      title="Leaderboard"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
import { nearApi } from "../axios";
import { useQuasar } from "quasar";
import { ref, onBeforeUnmount, onBeforeMount } from "vue";

const rows = ref([]);
let pollingTimer = undefined;

onBeforeUnmount(() => {
  clearInterval(pollingTimer);
});

onBeforeMount(() => {
  updateScores();
  pollingTimer = setInterval(() => {
    updateScores();
  }, 10000);
});

const updateScores = () => {
  const funcCallObj = {
    method: "query",
    params: {
      request_type: "call_function",
      account_id: "highfalutin-act.testnet",
      method_name: "get_scores",
      args_base64: "eyJhcHBfbmFtZSI6InJzcCJ9",
      finality: "optimistic",
    },
    id: 123,
    jsonrpc: "2.0",
  };

  nearApi
    .post("", funcCallObj)
    .then((resp) => {
      let bytes = new Int8Array(resp.data.result.result);
      let str = new TextDecoder().decode(bytes);
      const scoresObj = JSON.parse(str);
      rows.value = Object.keys(scoresObj).map((key) => {
        return {
          user: key,
          score: scoresObj[key],
        };
      });
    })
    .catch((error) => {
      const q = useQuasar();
      q.notify({
        type: "warning",
        message: `Failed to update the scores! ${error}`,
      });
    });
};

const columns = [
  { name: "user", label: "User", field: "user", sortable: true },
  { name: "score", label: "Score", field: "score", sortable: true },
];
</script>
