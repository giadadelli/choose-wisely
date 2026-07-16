<script setup lang="ts">
// Griglia macro-aree (SCRUM-22): riusa Card.vue + la mappa icone statica.
const { data } = useAreas()
</script>

<template>
  <div class="area-grid">
    <h2 class="area-grid__title">
      Esplora per area
    </h2>

    <div class="area-grid__grid">
      <NuxtLink
        v-for="macroArea in data.macroAreas"
        :key="macroArea.id"
        :to="`/area/${macroArea.slug}`"
        class="area-grid__link"
      >
        <Card class="area-grid__card">
          <i
            :class="['ti', getAreaIcon(macroArea.slug), 'area-grid__icon']"
            aria-hidden="true"
          />
          <h3>{{ macroArea.name }}</h3>
          <p v-if="macroArea.shortDescription">
            {{ macroArea.shortDescription }}
          </p>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.area-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

.area-grid__title {
  color: var(--color-neutral-700);
  font-size: var(--font-size-body);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.area-grid__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.area-grid__link {
  display: block;
  min-height: 44px;
  color: inherit;
  text-decoration: none;
}

.area-grid__card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.area-grid__icon {
  font-size: 1.5rem;
  color: var(--color-primary-600);
}

/* Breakpoint md (768px) usato come letterale — vedi nota in tokens.css */
@media (min-width: 768px) {
  .area-grid__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
