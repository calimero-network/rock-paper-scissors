<template>
  <wallet-ctx-provider-vue network="testnet">
    <near-login-vue
      :appId="appId"
      :rpcBaseUrl="rpcBaseUrl"
      :successRedirect="success"
      :navigateBack="auth"
    >
    </near-login-vue>
  </wallet-ctx-provider-vue>
</template>
<script>
import { applyPureReactInVue } from 'veaury'
// This is a React component
import { WalletSelectorContextProvider } from '@calimero-is-near/calimero-p2p-sdk/lib/wallet/NearLogin/WalletSelectorContext'
import NearLogin from '@calimero-is-near/calimero-p2p-sdk/lib/wallet/NearLogin/NearLogin'

import { useRouter } from 'vue-router'

export default {
  components: {
    // Use HOC 'applyReactInVue' or 'applyPureReactInVue'
    WalletCtxProviderVue: applyPureReactInVue(WalletSelectorContextProvider),
    NearLoginVue: applyPureReactInVue(NearLogin)
  },
  props: {
    appId: {
      type: String,
      required: true
    },
    rpcBaseUrl: {
      type: String,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    function success() {
      router.push('/')
    }

    function auth() {
      router.push('/')
    }

    return {
      success,
      auth
    }
  }
}
</script>
