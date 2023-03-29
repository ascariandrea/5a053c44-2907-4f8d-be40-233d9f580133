import path from 'path'
import dotenv from 'dotenv'
import { defineNuxtConfig } from 'nuxt/config'

dotenv.config({
  path: path.resolve(process.cwd(), process.env.DOT_ENV_PATH ?? '.env'),
})

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'graphql-auth'
const API_URL = process.env.API_URL ?? 'http://localhost:3000/graphql'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      GQL_HOST: API_URL,
      AUTH_COOKIE_NAME,
    },
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  devServer: {
    port: 3002,
  },
  app: {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
      title: '@weroad-test/backoffice',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['nuxt-graphql-client', '@nuxtjs/tailwindcss'],
  modulesDir: ['node_modules', '../../node_modules'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // // apollo configuration
  ...({
    'graphql-client': {
      clients: {
        default: {
          schema: path.resolve(process.cwd(), '../backend/src/schema.gql'),
          host: API_URL,
          // retainToken: true,
          tokenStorage: {
            name: AUTH_COOKIE_NAME,
            mode: 'cookie',
          },
        },
      },
    },
  } as any),
})
