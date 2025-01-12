<script setup>
import { ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useTeacherStore } from '../stores/teacherStore.js';
import colors from '../utils/colors.js';
import { v4 as uuidv4 } from 'uuid';

const confirm = useConfirm();
const teacherStore = useTeacherStore();
const teachers = ref(teacherStore.teachers);

const editingRows = ref([]);

const updateEditingRows = (id, add = true) => {
  editingRows.value = add
      ? [...editingRows.value, teacherStore.teachers.find((teacher) => teacher.id === id)]
      : editingRows.value.filter((row) => row.id !== id);
};

const onRowEditSave = ({ newData, index }) => {
  teacherStore.updateTeacher(index, newData);
  updateEditingRows(newData.id, false);
};

const onRowEditCancel = ({ data }) => {
  updateEditingRows(data.id, false);
};

const editTeacher = (data) => updateEditingRows(data.id);

const addTeacher = () => {
  const newTeacher = { id: uuidv4(), name: '', color: colors[teachers.value.length + 1] };
  teacherStore.addTeacher(newTeacher);
  updateEditingRows(newTeacher.id);
};

const confirmDeleteTeacher = (event, data) => {
  confirm.require({
    target: event.target,
    message: `Ви впевнені, що хочете видалити вчителя "${data.name}"?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Ні', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Так' },
    accept: () => deleteTeacher(data.id),
  });
};

const deleteTeacher = (id) => {
  const index = teacherStore.teachers.findIndex((teacher) => teacher.id === id);
  if (index !== -1) {
    teacherStore.removeTeacher(index);
  }
  updateEditingRows(id, false);
};

const isEditing = (id) => editingRows.value.some((row) => row.id === id);
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Вчителі</h1>
    <Button @click="addTeacher" icon="pi pi-plus" label="Додати вчителя" iconPos="right" size="small" />
  </div>
    <div class="card" v-if="teachers.length">
      <DataTable v-model:editingRows="editingRows" :value="teachers" editMode="row" dataKey="id">
        <Column field="name" header="Ім'я" style="width: 30%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" placeholder="Введіть ім'я вчителя" fluid />
          </template>
        </Column>
        <Column field="color" header="Колір" style="width: 30%">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <div class="rounded-full h-6 w-6" :style="{ backgroundColor: data.color }"></div>
            </div>
          </template>
        </Column>
        <Column header="" style="width: 20%; text-align:center">
          <template #body="{ data, index }">
            <div v-if="!isEditing(data.id)" class="flex items-center justify-end gap-3">
              <ConfirmPopup></ConfirmPopup>
              <Button @click="editTeacher(data)" severity="secondary" icon="pi pi-pencil" size="small" aria-label="Edit" />
              <Button @click="confirmDeleteTeacher($event, data)" severity="secondary" icon="pi pi-trash" size="small" aria-label="Delete" />
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
      <p class="mb-4">Ви ще не додали жодного вчителя</p>
      <Button @click="addTeacher" icon="pi pi-plus" label="Додати вчителя" iconPos="right" size="small" />
    </div>
</template>

<style scoped>

</style>
