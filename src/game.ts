import {
  JsonRpcClient,
  type RequestConfig,
  type RpcQueryResponse,
  type RpcResult
} from '@calimero-is-near/calimero-p2p-sdk/lib'
import { createAuthHeader, type AxiosHeader } from './crypto'

interface VersionRequest {
  // ignore
}

interface CreateKeyPairRequest {
  seed: number[]
}

interface KeyComponents {
  pk: string
  sk: string
}

interface PrepareRequest {
  signing_key: string
  choice: string
  nonce: number[]
}

interface JoinRequest {
  player_name: string
  public_key: string
}

interface CommitRequest {
  player_idx: number
  commitment: string
  signature: string
}

export class Game {
  constructor(nodeUrl: string, applicationId: string) {
    this.applicationId = applicationId
    this.seed = [...Array(32)].map(() => ~~(Math.random() * 255))
    this.nonce = [...Array(32)].map(() => ~~(Math.random() * 255))
    this.jsonRpcClient = new JsonRpcClient(nodeUrl, '/jsonrpc')
  }

  async query<Args, Output>(
    method: string,
    params: Args
  ): Promise<RpcResult<RpcQueryResponse<Output>>> {
    const authHeaders: AxiosHeader | null = await createAuthHeader(JSON.stringify(params))
    if (authHeaders === null) {
      throw new Error('Failed to getVersion')
    }
    const config: RequestConfig = {
      headers: authHeaders,
      timeout: 10000
    }
    return this.jsonRpcClient.query<Args, Output>(
      {
        method,
        applicationId: this.applicationId,
        argsJson: params
      },
      config
    )
  }

  async mutate<Args, Output>(
    method: string,
    params: Args
  ): Promise<RpcResult<RpcQueryResponse<Output>>> {
    const authHeaders: AxiosHeader | null = await createAuthHeader(JSON.stringify(params))
    if (authHeaders === null) {
      throw new Error('Failed to getVersion')
    }
    const config: RequestConfig = {
      headers: authHeaders,
      timeout: 10000
    }
    return this.jsonRpcClient.mutate<Args, Output>(
      {
        method,
        applicationId: this.applicationId,
        argsJson: params
      },
      config
    )
  }

  async getVersion(): Promise<string | undefined> {
    const params: VersionRequest = {}
    const response = await this.query<VersionRequest, string>('version', params)
    return response.result?.output
  }

  async resetState() {
    await this.mutate('reset_state', {})
  }

  async join(playerName: string): Promise<number | undefined> {
    const params: CreateKeyPairRequest = {
      seed: this.seed
    }
    const keysResponse = await this.query<CreateKeyPairRequest, KeyComponents>(
      'create_keypair',
      params
    )
    const keys = keysResponse.result?.output
    this.keys = keys

    const joinParams: JoinRequest = {
      player_name: playerName,
      public_key: keys!.pk
    }
    const joinResponse = await this.mutate<JoinRequest, number>('join', joinParams)
    console.log('**************************')
    console.log(joinResponse)
    console.log('**************************')

    this.playerIdx = joinResponse.result?.output
    return this.playerIdx
  }

  async submit(choice: string) {
    const params: PrepareRequest = {
      signing_key: this.keys!.sk,
      choice,
      nonce: this.nonce
    }
    const prepareResponse = await this.query<PrepareRequest, [string, string]>('prepare', params)

    this.commitment = prepareResponse.result?.output![0]
    this.signature = prepareResponse.result?.output![1]
    const commitResponse = await this.mutate<CommitRequest, {}>('commit', {
      player_idx: this.playerIdx!,
      commitment: this.commitment!,
      signature: this.signature!
    })

    console.log(commitResponse)
  }

  async reveal() {
    const revealResponse = await this.mutate('reveal', {
      player_idx: this.playerIdx,
      nonce: this.nonce
    })
    console.log(revealResponse)
  }

  applicationId: string
  seed: number[]
  nonce: number[]
  jsonRpcClient: JsonRpcClient
  keys: KeyComponents | undefined
  commitment: string | undefined
  signature: string | undefined
  playerIdx: number | undefined
}
