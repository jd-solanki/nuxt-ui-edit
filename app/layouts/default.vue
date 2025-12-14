<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'App Config',
      to: '/',
    },
  ],
  [
    {
      label: 'Components',
      type: 'label',
    },
    {
      label: 'Button',
      to: '/editor/button',
    },
  ],
]
</script>

<template>
  <div>
    <UMain>
      <UDashboardGroup>
        <!-- Sidebar -->
        <UDashboardSidebar
          :ui="{ header: 'border-b border-default' }"
          :default-size="12"
          toggle-side="right"
        >
          <template #header>
            <UIcon
              name="i-lucide-palette"
              class="size-6 me-1"
            />
            <h1 class="text-xl font-semibold">
              Nuxt UI Edit
            </h1>
          </template>

          <UNavigationMenu
            :items="items"
            orientation="vertical"
            :ui="{ separator: 'hidden' }"
          />
        </UDashboardSidebar>

        <!-- Content -->
        <UDashboardPanel
          id="content"
          resizable
          :default-size="60"
          :max-size="60"
          :min-size="40"
        >
          <template #header>
            <UDashboardNavbar title="Button">
              <!-- <template #leading>
                <UButton
                  icon="i-lucide-panel-left-close"
                  variant="ghost"
                  color="neutral"
                />
              </template> -->

              <template #right>
                <UDashboardSearchButton />
              </template>
            </UDashboardNavbar>
          </template>
          <template #body>
            <UContainer>
              <div class="p-4">
                <slot />
              </div>
            </UContainer>
          </template>
        </UDashboardPanel>

        <!-- Editor -->
        <Editor />

        <UDashboardSearch />
      </UDashboardGroup>
    </UMain>
  </div>
</template>
