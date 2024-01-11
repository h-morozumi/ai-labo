// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: {
    enabled: false,
    timeline: {
      enabled: false,
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      }
    }
  },
  ssr: false,
  plugins: [{ src: "~/plugins/msal.ts", mode: "client" }],
  runtimeConfig: {
    public: {
      // Keys within public are also exposed client-side
      // Entra ID
      clientId: process.env.CLIENTID,
      authority: process.env.AUTHORITY,
      redirectUri: process.env.REDIRECT_URI,
      postLogoutRedirectUri: process.env.POSTLOGOUT_REDIRECT_URI,
      // Azure Speech
      speechApiKey: process.env.SPEECH_API_KEY, // Azure Speech API Key
      speechRegion: 'westus2', // Azure Speech API Region
      // Azure Communication Services
      iceServerUrl: 'turn:relay.communication.microsoft.com:3478', // Azure Communication Services ICE Server URL
      iceServerUsername: process.env.ICE_SERVER_USERNAME, // Azure Communication Services ICE Server Username
      iceServerCredential: process.env.ICE_SERVER_CREDENTIAL, // Azure Communication Services ICE Server Credential
    },
    // The private keys which are only available server-side
    // MS Graph API
    graphApiUrl: 'https://graph.microsoft.com/v1.0/me', // Microsoft Graph API URL  
    openAi: {
      apiKey: process.env.OPENAI_API_KEY,
    }
  },
});