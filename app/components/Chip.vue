<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="chip"
    :class="{ 'chip--selected': selected }"
    :aria-pressed="selected"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-2) var(--space-4);
  border-radius: 999px;
  border: 1px solid var(--color-neutral-300);
  background-color: var(--color-neutral-0);
  color: var(--color-neutral-900);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.chip:hover {
  border-color: var(--color-primary-500);
}

.chip--selected {
  background-color: var(--color-primary-100);
  border-color: var(--color-primary-600);
  color: var(--color-primary-700);
}
</style>
