<script lang="ts" setup>
import { computedWithControl, useClipboard } from '@vueuse/core'

const appConfig = useAppConfig()

const { copy, isSupported, copied } = useClipboard()

const diff = computedWithControl(
  () => appConfig.ui,
  () => classObjDiff(toRaw(appConfig.ui), toRaw(appConfig.uiDefaultAppConfig)),
  { deep: true },
)
const appConfigString = computed(() => {
  const diffValue = diff.value || {}
  return `export default defineAppConfig(${JSON.stringify({ ui: diffValue }, null, 2)})`
})
</script>

<template>
  <div>
    <header
      class="flex items-center justify-between mb-8"
    >
      <h1 class="text-xl font-semibold">
        App Config
      </h1>
      <UButton
        :disabled="!isSupported"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        @click="copy(appConfigString)"
      >
        Copy Config
      </UButton>
    </header>

    <div class="p-4 rounded-lg border border-default">
      <pre class="max-h-175 text-sm font-mono overflow-auto">{{ appConfigString }}</pre>
    </div>
  </div>
</template>
