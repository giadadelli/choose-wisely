<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="`btn--${variant}`"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: var(--space-2) var(--space-4);
  border-radius: 8px;
  border: 1px solid transparent;
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn--primary {
  background-color: var(--color-primary-600);
  color: var(--color-neutral-0);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-700);
}

.btn--secondary {
  background-color: var(--color-secondary-500);
  color: var(--color-neutral-0);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-700);
}

.btn--outline {
  background-color: transparent;
  border-color: var(--color-primary-600);
  color: var(--color-primary-700);
}

.btn--outline:hover:not(:disabled) {
  background-color: var(--color-primary-50);
}
</style>
