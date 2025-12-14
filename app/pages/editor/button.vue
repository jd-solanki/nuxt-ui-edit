<template>
  <div class="space-y-10">
    <!-- Colors -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          Colors & Variants
        </h4>
      </template>

      <div class="space-y-6">
        <div class="space-x-4 space-y-4">
          <UButton
            v-for="color in COLORS"
            :key="color"
            :color="color"
            class="capitalize"
          >
            {{ color }}
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Variants -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          Variants
        </h4>
      </template>

      <div
        v-for="color in COLORS"
        :key="color"
        class="space-x-4 space-y-4"
      >
        <UButton
          v-for="variant in VARIANTS"
          :key="variant + color"
          :color="color"
          :variant="variant"
          class="capitalize"
        >
          {{ variant }}
        </UButton>
      </div>
    </UCard>

    <!-- Sizes -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          Sizes
        </h4>
      </template>

      <div
        v-for="variant in VARIANTS"
        :key="variant"
        class="space-x-4 space-y-4"
      >
        <UButton
          v-for="size in SIZES"
          :key="size + size"
          :size="size"
          :variant="variant"
        >
          {{ size }}
        </UButton>
      </div>
    </UCard>

    <!-- Leading Icon -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          Leading Icon
        </h4>
      </template>

      <div
        v-for="size in SIZES"
        :key="size"
        class="space-x-4 space-y-4"
      >
        <UButton
          v-for="variant in VARIANTS"
          :key="variant + size"
          :size="size"
          :variant="variant"
          icon="i-lucide-home"
        >
          Button
        </UButton>
      </div>
    </UCard>

    <!-- Trailing Icon -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          Trailing Icon
        </h4>
      </template>

      <div
        v-for="size in SIZES"
        :key="size"
        class="space-x-4 space-y-4"
      >
        <UButton
          v-for="variant in VARIANTS"
          :key="variant + size"
          :size="size"
          :variant="variant"
          trailing-icon="i-lucide-arrow-right"
        >
          Button
        </UButton>
      </div>
    </UCard>

    <!-- Icon Only -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          Icon Only
        </h4>
      </template>

      <div
        v-for="size in SIZES"
        :key="size"
        class="space-x-4 space-y-4"
      >
        <UButton
          v-for="variant in VARIANTS"
          :key="variant + size"
          :size="size"
          :variant="variant"
          trailing-icon="i-lucide-search"
        />
      </div>
    </UCard>

    <!-- Loading -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          Loading
        </h4>
      </template>

      <div
        v-for="size in SIZES"
        :key="size"
        class="space-x-4 space-y-4"
      >
        <UButton
          v-for="variant in VARIANTS"
          :key="variant + size"
          :size="size"
          :variant="variant"
          :loading="true"
          icon="i-lucide-home"
        >
          Button
        </UButton>
      </div>
    </UCard>

    <!-- States -->
    <UCard>
      <template #header>
        <h4 class="font-medium">
          States
        </h4>
      </template>

      <div
        v-for="size in SIZES"
        :key="size"
        class="space-x-4 space-y-4"
      >
        <UButton
          v-for="variant in VARIANTS"
          :key="variant + size"
          :size="size"
          :variant="variant"
        >
          Button
        </UButton>
      </div>
    </UCard>
  </div>
</template>
