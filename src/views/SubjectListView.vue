<script setup>
import { ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useSubjectStore } from '../stores/subjectStore.js';
import { useTeacherStore } from '../stores/teacherStore.js';
import { useClassStore } from '../stores/classStore.js';
import { v4 as uuidv4 } from 'uuid';

const confirm = useConfirm();
const subjectStore = useSubjectStore();
const teacherStore = useTeacherStore();
const classStore = useClassStore();
const subjects = ref(subjectStore.subjects);
const teachers = ref(teacherStore.teachers);
const classes = ref(classStore.classes);

const editingRows = ref([]);

const updateEditingRows = (id, add = true) => {
  editingRows.value = add
      ? [...editingRows.value, subjectStore.subjects.find((subject) => subject.id === id)]
      : editingRows.value.filter((row) => row.id !== id);
};

const onRowEditSave = ({ newData, index }) => {
  subjectStore.updateSubject(index, newData);
  updateEditingRows(newData.id, false);
};

const onRowEditCancel = ({ data }) => {
  updateEditingRows(data.id, false);
};

const editSubject = (data) => updateEditingRows(data.id);

const addSubject = () => {
  const newSubject = { id: uuidv4(), name: '', lessonsPerWeek: 1, teacherId: null, classId: null };
  subjectStore.addSubject(newSubject);
  updateEditingRows(newSubject.id);
};

const confirmDeleteSubject = (event, data) => {
  confirm.require({
    target: event.target,
    message: `Ви впевнені, що хочете видалити предмет "${data.name}"?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Ні', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Так' },
    accept: () => deleteSubject(data.id),
  });
};

const deleteSubject = (id) => {
  const index = subjectStore.subjects.findIndex((subject) => subject.id === id);
  if (index !== -1) {
    subjectStore.removeSubject(index);
  }
  updateEditingRows(id, false);
};

const isEditing = (id) => editingRows.value.some((row) => row.id === id);
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Предмети</h1>
    <Button @click="addSubject" icon="pi pi-plus" label="Додати предмет" iconPos="right" size="small" />
  </div>
  <div class="card" v-if="subjects.length">
    <DataTable v-model:editingRows="editingRows" :value="subjects" editMode="row" dataKey="id">
      <Column field="name" header="Назва предмету" style="width: 20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" placeholder="Введіть назву предмету" fluid />
        </template>
      </Column>
      <Column field="lessonsPerWeek" header="Уроків на тиждень" style="width: 20%">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" placeholder="Уроків на тиждень" min="1" fluid />
        </template>
      </Column>
      <Column field="teacherId" header="Вчитель" style="width: 20%">
        <template #editor="{ data, field }">
          <Select v-model="data[field]" :options="teacherStore.teachers" optionLabel="name" optionValue="id" placeholder="Виберіть вчителя" fluid />
        </template>
        <template #body="{ data }">
          <span>{{ teacherStore.teachers.find((teacher) => teacher.id === data.teacherId)?.name }}</span>
        </template>
      </Column>
      <Column field="classId" header="Клас" style="width: 20%">
        <template #editor="{ data, field }">
          <Select v-model="data[field]" :options="classStore.classes" optionLabel="name" optionValue="id" placeholder="Виберіть клас" fluid />
        </template>
        <template #body="{ data }">
          <span>{{ classStore.classes.find((classItem) => classItem.id === data.classId)?.name }}</span>
        </template>
      </Column>
      <Column header="" style="width: 20%; text-align:center">
        <template #body="{ data, index }">
          <div v-if="!isEditing(data.id)" class="flex items-center justify-end gap-3">
            <ConfirmPopup></ConfirmPopup>
            <Button @click="editSubject(data)" severity="secondary" icon="pi pi-pencil" size="small" aria-label="Edit" />
            <Button @click="confirmDeleteSubject($event, data)" severity="secondary" icon="pi pi-trash" size="small" aria-label="Delete" />
          </div>
          <div v-else class="flex items-center justify-end gap-3">
            <Button @click="onRowEditSave({ newData: data, index: index })" severity="secondary" icon="pi pi-check" size="small" aria-label="Save" />
            <Button @click="onRowEditCancel({ data })" severity="secondary" icon="pi pi-times" size="small" aria-label="Cancel" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-else>
    <div v-if="!teachers.length || !classes.length" class="flex items-center flex-col bg-gray-100 my-8 rounded p-8">
      <p class="mb-4">Додайте вчителів та класи, щоб додати предмети</p>
      <div class="flex items-center gap-3">
        <Button @click="$router.push('/teachers')" icon="pi pi-plus" label="Додати вчителя" iconPos="right" size="small"/>
        <Button @click="$router.push('/classes')" icon="pi pi-plus" label="Додати клас" iconPos="right" size="small"/>
      </div>
    </div>
    <div v-else class="flex items-center flex-col bg-gray-100 my-8 rounded p-8">
      <p class="mb-4">Ви ще не додали жодного предмету</p>
      <Button @click="addSubject" icon="pi pi-plus" label="Додати предмет" iconPos="right" size="small" />
    </div>
  </div>
</template>

<style scoped>
</style>
