<script setup>
import { ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useClassStore } from '../stores/classStore.js';
import { v4 as uuidv4 } from 'uuid';

const confirm = useConfirm();
const classStore = useClassStore();
const classes = ref(classStore.classes);

const editingRows = ref([]);

const updateEditingRows = (id, add = true) => {
  editingRows.value = add
      ? [...editingRows.value, classStore.classes.find((classItem) => classItem.id === id)]
      : editingRows.value.filter((row) => row.id !== id);
};

const onRowEditSave = ({ newData, index }) => {
  classStore.updateClass(index, newData);
  updateEditingRows(newData.id, false);
};

const onRowEditCancel = ({ data }) => {
  updateEditingRows(data.id, false);
};

const editClass = (data) => updateEditingRows(data.id);

const addClass = () => {
  const newClass = { id: uuidv4(), name: '', maxLessonsPerDay: 6 }; // Додаємо нове поле для максимальних уроків
  classStore.addClass(newClass);
  updateEditingRows(newClass.id);
};

const confirmDeleteClass = (event, data) => {
  confirm.require({
    target: event.target,
    message: `Ви впевнені, що хочете видалити клас "${data.name}"?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Ні', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Так' },
    accept: () => deleteClass(data.id),
  });
};

const deleteClass = (id) => {
  const index = classStore.classes.findIndex((classItem) => classItem.id === id);
  if (index !== -1) {
    classStore.removeClass(index);
  }
  updateEditingRows(id, false);
};

const isEditing = (id) => editingRows.value.some((row) => row.id === id);
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Класи</h1>
    <Button @click="addClass" icon="pi pi-plus" label="Додати клас" iconPos="right" size="small" />
  </div>
  <div class="card" v-if="classes.length">
    <DataTable v-model:editingRows="editingRows" :value="classes" editMode="row" dataKey="id">
      <Column field="name" header="Назва класу" style="width: 25%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" placeholder="Введіть назву класу" fluid />
        </template>
      </Column>
      <Column field="maxLessonsPerDay" header="Макс. кількість уроків на день" style="width: 25%">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" placeholder="Макс. кількість уроків" min="3" max="7" fluid />
        </template>
      </Column>
      <Column header="" style="width: 20%; text-align:center">
        <template #body="{ data, index }">
          <div v-if="!isEditing(data.id)" class="flex items-center justify-end gap-3">
            <ConfirmPopup></ConfirmPopup>
            <Button @click="editClass(data)" severity="secondary" icon="pi pi-pencil" size="small" aria-label="Edit" />
            <Button @click="confirmDeleteClass($event, data)" severity="secondary" icon="pi pi-trash" size="small" aria-label="Delete" />
          </div>
          <div v-else class="flex items-center justify-end gap-3">
            <Button @click="onRowEditSave({ newData: data, index: index })" severity="secondary" icon="pi pi-check" size="small" aria-label="Save" />
            <Button @click="onRowEditCancel({ data })" severity="secondary" icon="pi pi-times" size="small" aria-label="Cancel" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div class="flex items-center flex-col bg-gray-100 my-8 rounded p-8" v-else>
    <p class="mb-4">Ви ще не додали жодного класу</p>
    <Button @click="addClass" icon="pi pi-plus" label="Додати клас" iconPos="right" size="small" />
  </div>
</template>

<style scoped>
</style>
