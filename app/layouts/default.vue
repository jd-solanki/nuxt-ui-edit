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
                <UDashboardSearchButton class="me-4" />
                <UButton
                  icon="i-lucide-github"
                  to="http://github.com/jd-solanki/nuxt-ui-edit"
                  target="_blank"
                  size="md"
                  variant="ghost"
                  color="neutral"
                />
                <UColorModeButton />
              </template>
            </UDashboardNavbar>
          </template>
          <template #body>
            <UContainer>
              <div class="p-4">
                <UAlert
                  color="warning"
                  class="mb-8 lg:hidden"
                  icon="i-lucide-triangle-alert"
                  title="Editor is only available in large displays"
                />
                <UAlert
                  color="warning"
                  class="mb-8 xl:hidden max-lg:hidden"
                  icon="i-lucide-triangle-alert"
                  title="Prefer larger displays for better experience"
                />
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
