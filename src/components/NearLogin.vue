<template>
  <wallet-ctx-provider-vue network="testnet">
    <near-login-vue
      appId="4a69641790ae9b710c29ee99edb2c8560812e7752bb392cdf001ee0002fa4647"
      rpcBaseUrl="http://localhost:2528"
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
