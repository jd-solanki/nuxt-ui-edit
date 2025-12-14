<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import _buttonConfig from '#build/ui/button'

const buttonConfig = ref(JSON.parse(JSON.stringify(_buttonConfig)))

const items = ref<TabsItem[]>([
  {
    label: 'Tree',
    icon: 'i-lucide-list-tree',
    value: 'tree',
  },
  {
    label: 'Text',
    icon: 'i-lucide-code',
    value: 'text',
  },
])

const editorMode = ref<'tree' | 'text' | 'table'>('text')
const colorMode = useColorMode()

function handleChange(data: { text?: string, json?: any }) {
  try {
    const parsed = data.json || JSON.parse(data.text || '{}')
    updateAppConfig({
      ui: {
        button: parsed, // https://github.com/nuxt/ui/issues/5673
      },
    })
    updateAppConfig({
      uiDefaultAppConfig: {
        button: JSON.parse(JSON.stringify(_buttonConfig)),
      },
    })
  }
  catch {}
}

function reset() {
  updateAppConfig({
    ui: {
      button: JSON.parse(JSON.stringify(_buttonConfig)),
    },
  })
  buttonConfig.value = JSON.parse(JSON.stringify(_buttonConfig))
}
</script>

<template>
  <UDashboardPanel
    id="editor"
    :ui="{ body: 'p-0!' }"
  >
    <template #header>
      <UDashboardNavbar title="Editor">
        <template #right>
          <UButton
            icon="i-lucide-refresh-cw"
            @click="reset"
          >
            Reset
          </UButton>
          <UTabs
            v-model="editorMode"
            :content="false"
            :items="items"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <json-editor
        v-model="buttonConfig"
        class="h-full"
        :mode="editorMode"
        :main-menu-bar="false"
        :navigation-bar="false"
        :status-bar="false"
        :dark-theme="colorMode.value === 'dark'"
        @change="handleChange"
      />
    </template>
  </UDashboardPanel>
</template>
