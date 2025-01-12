<script setup>
import Menubar from 'primevue/menubar';
import { ref } from 'vue';
import {useRouter} from "vue-router";

const router = useRouter();


const items = ref([
  {
    label: 'Розклад',
    key: 'schedule',
    icon: 'pi pi-calendar',
    command: () => router.push({ name: 'Home' }),
  },
  {
    label: 'Предмети',
    key: 'subjects',
    icon: 'pi pi-book',
    command: () => router.push({ name: 'Subjects' }),
  },
  {
    label: 'Вчителі',
    key: 'teachers',
    icon: 'pi pi-user',
    command: () => router.push({ name: 'Teachers' }),
  },
  {
    label: 'Класи',
    key: 'classes',
    icon: 'pi pi-users',
    command: () => router.push({ name: 'Classes' }),
  }
]);
</script>

<template>
  <Menubar :model="items" />
</template>

<style scoped>

</style>
