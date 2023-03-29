import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {},
  content: [
    `components/**/*.{vue,js,ts}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
  ],
  plugins: [require('@tailwindcss/forms')],
}
