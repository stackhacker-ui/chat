<script setup lang="ts">
const el = ref<HTMLElement>()
const isInsidePre = ref(false)

onMounted(() => {
  isInsidePre.value = !!el.value?.closest('pre')
})
</script>

<template>
  <code
    ref="el"
    :class="[
      !isInsidePre && 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border border-border bg-muted'
    ]"
  >
    <slot />
  </code>
</template>
