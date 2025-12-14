<script lang="ts" setup>
const appConfig = useAppConfig()
updateAppConfig({
  uiDefaultAppConfig: JSON.parse(JSON.stringify(appConfig.ui)),
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
