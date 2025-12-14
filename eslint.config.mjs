// @ts-check
import antfu from '@antfu/eslint-config'
import pluginCasePolice from 'eslint-plugin-case-police'
import harlanzw from 'eslint-plugin-harlanzw'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Global ignores - applies to all configurations
  {
    ignores: [
      './server/db/migrations/**/*',
      // This is downloaded from remote source, we don't want to lint it.
      './.ai/rules/nuxt-ui.instructions.md',
    ],
  },
  antfu({
    vue: {
      overrides: {
        'vue/max-attributes-per-line': 'error',
      },
    },
    typescript: true,
    stylistic: {},
  }),
  // Add regex plugin for custom rules
  {
    plugins: {
      'case-police': pluginCasePolice,
      harlanzw,
    },
    rules: {
      'case-police/string-check': 'warn',

      'harlanzw/link-ascii-only': 'error',
      'harlanzw/link-lowercase': 'error',
      'harlanzw/link-no-double-slashes': 'error',
      'harlanzw/link-no-whitespace': 'error',
      'harlanzw/nuxt-await-navigate-to': 'error',
      'harlanzw/nuxt-no-redundant-import-meta': 'error',
      'harlanzw/nuxt-no-side-effects-in-async-data-handler': 'error',
      'harlanzw/nuxt-no-side-effects-in-setup': 'error',
      'harlanzw/nuxt-prefer-navigate-to-over-router-push-replace': 'error',
      'harlanzw/nuxt-prefer-nuxt-link-over-router-link': 'error',
      // 'harlanzw/vue-no-faux-composables': 'error', /* This isn't working accurately due to auto-imports */
      'harlanzw/vue-no-nested-reactivity': 'error',
      'harlanzw/vue-no-passing-refs-as-props': 'error',
      'harlanzw/vue-no-reactive-destructuring': 'error',
      'harlanzw/vue-no-ref-access-in-templates': 'error',
      'harlanzw/vue-no-torefs-on-props': 'error',
    },
    ignores: ['eslint.config.mjs'],
  },
).overrideRules({
  'node/prefer-global/process': ['error', 'always'],
})