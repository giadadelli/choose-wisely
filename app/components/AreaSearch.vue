<script setup lang="ts">
// Hero + ricerca homepage (SCRUM-20 markup, SCRUM-21 logica autocomplete).
const { data } = useAreas()

const query = ref('')
const activeIndex = ref(-1)

const isOpen = computed(() => query.value.trim().length > 0)

const results = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return []

  return data.value.subAreas.filter((subArea) => {
    if (subArea.name.toLowerCase().includes(needle)) return true
    return subArea.keywords.some(keyword => keyword.toLowerCase().includes(needle))
  })
})

watch(results, () => {
  activeIndex.value = -1
})

function goToArea(slug: string) {
  query.value = ''
  activeIndex.value = -1
  navigateTo(`/area/${slug}`)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    query.value = ''
    activeIndex.value = -1
    return
  }

  if (!isOpen.value || results.value.length === 0) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = activeIndex.value <= 0 ? results.value.length - 1 : activeIndex.value - 1
  }
  else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    goToArea(results.value[activeIndex.value]!.slug)
  }
}
</script>

<template>
  <div class="area-search">
    <h1>Che problema vuoi risolvere oggi?</h1>

    <div class="area-search__field">
      <i
        class="ti ti-search area-search__icon"
        aria-hidden="true"
      />
      <input
        v-model="query"
        type="text"
        class="area-search__input"
        placeholder="cerca un problema…"
        aria-label="Cerca un problema"
        autocomplete="off"
        @keydown="onKeydown"
      >
    </div>

    <ul
      v-if="isOpen"
      class="area-search__results"
    >
      <li v-if="results.length === 0">
        <span class="area-search__empty">Nessun risultato</span>
      </li>
      <li
        v-for="(result, index) in results"
        :key="result.id"
      >
        <button
          type="button"
          class="area-search__result"
          :class="{ 'area-search__result--active': index === activeIndex }"
          @click="goToArea(result.slug)"
          @mouseenter="activeIndex = index"
        >
          {{ result.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.area-search {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4);
}

.area-search__field {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--color-neutral-300);
  border-radius: 8px;
  background-color: var(--color-neutral-0);
}

.area-search__icon {
  position: absolute;
  left: var(--space-3);
  color: var(--color-neutral-700);
  font-size: 1.125rem;
  pointer-events: none;
}

.area-search__input {
  width: 100%;
  min-height: 44px;
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-8);
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  color: var(--color-neutral-900);
}

.area-search__input:focus {
  outline: 2px solid var(--color-primary-600);
  outline-offset: -2px;
}

.area-search__results {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--color-neutral-0);
}

.area-search__result {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: var(--space-2) var(--space-4);
  border: none;
  background: transparent;
  text-align: left;
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  color: var(--color-neutral-900);
  cursor: pointer;
}

.area-search__result:not(:last-child) {
  border-bottom: 1px solid var(--color-neutral-100);
}

.area-search__result:hover,
.area-search__result--active {
  background-color: var(--color-primary-50);
}

.area-search__empty {
  display: block;
  padding: var(--space-2) var(--space-4);
  color: var(--color-neutral-700);
  font-size: var(--font-size-body);
}
</style>
