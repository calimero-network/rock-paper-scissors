import axios from "axios";

export class Game {
  constructor(nodeUrl, applicationId) {
    this.axios = axios.create({ baseURL: `${nodeUrl}/jsonrpc` })
    this.applicationId = applicationId
    this.seed = [...Array(32)].map(e => ~~(Math.random() * 255))
    this.nonce = [...Array(32)].map(e => ~~(Math.random() * 255))
  }

  async sendJsonRpc(method, params) {
    const response = await this.axios.post("", {
      jsonrpc: "2.0",
      id: ~~(Math.random() * 50000),
      method,
      params
    });

    if (response.data && response.data.error) {
      console.log(response)
      throw new Error(response.data.error.data)
    }

    return response;
  }

  async query(method, argsJson) {
    return await this.sendJsonRpc("query",
      {
        applicationId: this.applicationId,
        method,
        argsJson,
      },
    );
  };

  async mutate(method, argsJson) {
    return this.sendJsonRpc("mutate",
      {
        applicationId: this.applicationId,
        method,
        argsJson,
      },
    );
  }

  async getVersion() {
    const response = await this.query(
      "version",
      {}
    );
    return response.data.result.output;
  }

  async resetState() {
    const response = await this.mutate(
      "reset_state",
      {}
    );
  }

  async join(playerName) {
    const keysResponse = await this.query(
      "create_keypair",
      {
        seed: this.seed
      }
    );
    const keys = keysResponse.data.result.output;
    this.keys = keys;

    const joinResponse = await this.mutate(
      "join",
      {
        player_name: playerName,
        public_key: keys.pk
      }
    );

    this.player_idx = joinResponse.data.result.output
    return this.player_idx;
  }

  async submit(choice) {
    const prepareResponse = await this.query(
      "prepare",
      {
        signing_key: this.keys.sk,
        choice,
        nonce: this.nonce
      }
    );

    this.commitment = prepareResponse.data.result.output[0];
    this.signature = prepareResponse.data.result.output[1];
    const commitResponse = await this.mutate(
      "commit",
      {
        player_idx: this.player_idx,
        commitment: this.commitment,
        signature: this.signature
      }
    );

    console.log(commitResponse);
  }

  async reveal() {
    const revealResponse = await this.mutate(
      "reveal",
      {
        player_idx: this.player_idx,
        nonce: this.nonce
      }
    );
    console.log(revealResponse);
  }
}
