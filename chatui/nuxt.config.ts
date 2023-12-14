// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  ssr: false,
  plugins: [{ src: "~/plugins/msal.ts", mode: "client" }],
  runtimeConfig: {
    public: {
      // Keys within public are also exposed client-side
      clientId: process.env.CLIENTID,
      authority: process.env.AUTHORITY,
      redirectUri: process.env.REDIRECT_URI,
      postLogoutRedirectUri: process.env.POSTLOGOUT_REDIRECT_URI,
    },
    // The private keys which are only available server-side
  },
});