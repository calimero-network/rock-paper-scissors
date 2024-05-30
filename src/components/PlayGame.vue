<template>
  <div class="col column q-pa-sm">
    <q-input
      dense
      outlined
      label="Application ID"
      v-model="applicationId"
      class="q-mr-xs bg-white"
    />
    <div class="row q-pa-sm">
      <q-input dense outlined label="Node URL" v-model="nodeUrl" class="col q-mr-xs bg-white" />
      <q-btn color="primary" flat no-caps class="q-mr-xs" @click="connectToNode">Connect</q-btn>
    </div>
    <q-separator />
    <div class="q-ml-md row items-center justify-center">
      <div class="col text-grey-8 text-bold">Game Version:</div>
      <div class="col text-grey-10 text-bold">{{ gameVersion }}</div>
    </div>
    <div class="row q-pa-sm">
      <q-input dense outlined label="Your name" class="col bg-white q-mr-xs" v-model="playerName" />
      <q-btn color="primary" :disable="game === null" no-caps class="q-mr-xs" @click="join"
        >Join</q-btn
      >
      <q-btn no-caps color="negative" @click="reset">Reset</q-btn>
    </div>
    <div class="q-ml-md row items-center justify-center">
      <div class="text-grey-8 q-mr-sm">Player ID:</div>
      <div class="col text-grey-10 text-bold">{{ playerId }}</div>
    </div>
    <div class="q-ml-md row items-center justify-center">
      <div class="text-grey-8 q-mr-sm">Opponent:</div>
      <div class="col text-grey-10">
        <span v-if="players[1 - playerId] === null"> Not joined </span>
        <span v-else class="text-bold"> {{ players[1 - playerId] }} </span>
        <span
          v-if="players[1 - playerId] !== null && !opponentCommited"
          class="text-warning q-ml-sm"
        >
          Not commited!
        </span>
        <span v-else class="text-green q-ml-sm"> Commited </span>
        <span
          v-if="players[1 - playerId] !== null && !opponentRevealed"
          class="text-warning q-ml-sm"
        >
          Not Revealed!
        </span>
        <span v-else class="text-green q-ml-sm"> Revealed </span>
      </div>
    </div>
    <div class="row q-pa-sm q-pt-md items-center q-gutter-x-sm">
      <q-option-group
        v-model="choice"
        dense
        no-caps
        toggle-color="primary"
        inline
        :options="[
          { label: '✊', value: 'Rock' },
          { label: '✋', value: 'Paper' },
          { label: '✌', value: 'Scissors' }
        ]"
      />
      <q-space />
      <q-btn no-caps dense color="secondary" @click="submit">Commit</q-btn>
      <q-btn no-caps dense color="secondary" @click="reveal" :disable="!opponentCommited"
        >Reveal</q-btn
      >
    </div>
    <div v-if="winnerIdx !== null" class="justify-center q-mt-md row text-bold text-h6 text-grey-8">
      <span v-if="winnerIdx === playerId"> You won the game 🎉🎊</span>
      <span v-else> You lost the game 🥲 </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Game } from '../game'
import GameEventListener from '../ws'

const nodeUrl = ref('http://localhost:2428')
const applicationId = ref('4a69641790ae9b710c29ee99edb2c8560812e7752bb392cdf001ee0002fa4647')
const gameVersion = ref('Not Connected')
const choice = ref('Rock')
const playerName = ref('')
let game = null
const playerId = ref(null)
let ws = null
const opponentCommited = ref(false)
const opponentRevealed = ref(false)
const players = ref({})
const winnerIdx = ref(null)

const connectToNode = async () => {
  game = new Game(nodeUrl.value, applicationId.value)
  ws = new GameEventListener(nodeUrl.value, applicationId.value)
  ws.on('NewPlayer', (player) => {
    console.log(player.id, playerId.value)
    players.value[player.id] = player.name
    console.log(players)
  })

  ws.on('PlayerCommited', (player) => {
    if (player.id !== playerId.value) {
      opponentCommited.value = true
    }
  })

  ws.on('PlayerRevealed', (player) => {
    if (player.id !== playerId.value) {
      opponentRevealed.value = true
    }
  })

  ws.on('GameOver', (winner) => (winnerIdx.value = winner.winner))

  gameVersion.value = await game.getVersion()
}

const join = async () => {
  try {
    playerId.value = Number.parseInt(await game.join(playerName.value))
  } catch (error) {
    console.error(error)
  }
}

const submit = async () => {
  try {
    console.log(await game.submit(choice.value))
  } catch (error) {
    console.error(error)
  }
}

const reset = async () => {
  try {
    await game.hardReset() // To clear contract's state
  } catch (error) {
    console.error(error)
  }

  game = new Game(nodeUrl.value, applicationId.value)
  opponentCommited.value = false
  players.value = {}
  opponentRevealed.value = false
  winnerIdx.value = null
}

const reveal = async () => {
  try {
    await game.reveal()
  } catch (error) {
    console.log(error)
  }
}
</script>
