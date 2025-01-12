<script setup>
import Menubar from 'primevue/menubar';
import { ref } from 'vue';


const items = ref([
  {
    label: 'Розклад',
    key: 'schedule',
    icon: 'pi pi-calendar',
    url: '/'
  },
  {
    label: 'Предмети',
    key: 'subjects',
    icon: 'pi pi-book',
    url: '/subjects',
  },
  {
    label: 'Вчителі',
    key: 'teachers',
    icon: 'pi pi-user',
    url: '/teachers',
  },
  {
    label: 'Класи',
    key: 'classes',
    icon: 'pi pi-users',
    url: '/classes',
  }
]);
</script>

<template>
  <Menubar :model="items" />
</template>

<style scoped>

</style>
