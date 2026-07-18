<template>
  <div class="trust-teaser">
    <div
      class="trust-teaser__image"
      aria-hidden="true"
    />

    <div class="trust-teaser__content">
      <h2>Un progetto pensato per aiutarti a scegliere con fiducia</h2>
      <p>
        Raccogliamo informazioni chiare e verificate per orientarti tra le opzioni disponibili, senza fretta e senza conflitti di interesse.
      </p>
      <NuxtLink
        to="/chi-siamo"
        class="trust-teaser__link"
      >
        Scopri di più
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.trust-teaser {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-4);
  border-top: 1px solid var(--color-neutral-300);
}

.trust-teaser__image {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border: 1px dashed var(--color-neutral-500);
  border-radius: 8px;
}

.trust-teaser__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.trust-teaser__link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--color-primary-600);
  font-weight: 600;
  text-decoration: none;
}

.trust-teaser__link:hover,
.trust-teaser__link:focus-visible {
  text-decoration: underline;
}
</style>
