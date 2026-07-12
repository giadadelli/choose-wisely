<script setup lang="ts">
// Live region condivisa per gli annunci screen-reader di useAriaLive().
// Va montata una sola volta (in app.vue): componenti/pagine annunciano
// tramite il composable, non renderizzando una propria region.
const { state } = useAriaLive()
</script>

<template>
  <div
    class="visually-hidden-live"
    :aria-live="state.politeness"
    aria-atomic="true"
  >
    {{ state.message }}
  </div>
</template>

<style scoped>
.visually-hidden-live {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
