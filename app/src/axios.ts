import axios from 'axios'

const nearApi = axios.create({ baseURL: 'https://rpc.testnet.near.org/' })

export { axios, nearApi }
