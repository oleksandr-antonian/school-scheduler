<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useLessonStore } from '../stores/lessonStore.js';
import { useClassStore } from '../stores/classStore.js';
import { useSubjectStore } from '../stores/subjectStore.js';
import { useTeacherStore } from '../stores/teacherStore.js';

const dayNames = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];
const lessonNumbers = [1, 2, 3, 4, 5, 6, 7];

const lessonStore = useLessonStore();
const classStore = useClassStore();
const subjectStore = useSubjectStore();
const teacherStore = useTeacherStore();

const lessons = ref(lessonStore.lessons);
const classes = ref(classStore.classes);
const subjects = ref(subjectStore.subjects);
const teachers = ref(teacherStore.teachers);

const schedule = ref({});
const draggedLesson = ref(null);
const duplicateLessons = ref([]);

const findDuplicates = (lessons) => {
  const map = new Map();

  lessons.forEach(lesson => {
    const key = `${lesson.day}-${lesson.lessonNumber}-${lesson.teacherId}`;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(lesson);
  });

  return Array.from(map.values()).filter(group => group.length > 1);
};


const generateSchedule = () => {
  duplicateLessons.value = findDuplicates(lessons.value);
  dayNames.forEach((day, dayIndex) => {
    const classesSchedule = {};
    classes.value.forEach((classItem) => {
      const lessonsSchedule = {};
      for (let i = 0; i < 7; i++) {
        const lesson = lessons.value.find(
            (lesson) =>
                lesson.classId === classItem.id &&
                lesson.day === dayIndex &&
                lesson.lessonNumber === i
        );
        lessonsSchedule[i] = lesson || null;
      }
      classesSchedule[classItem.id] = lessonsSchedule;
    });
    schedule.value[dayIndex] = classesSchedule;
  });
};

const handleDragStart = (lesson) => {
  draggedLesson.value = lesson;
};

const handleDragOver = (event, classId) => {
  if (draggedLesson.value && draggedLesson.value.classId === classId) {
    event.preventDefault(); // Allow drop
  }
};

const handleDrop = (dayIndex, classId, lessonIndex) => {
  if (
      draggedLesson.value &&
      draggedLesson.value.classId === classId
  ) {

    // Update the lesson in the store
    lessonStore.updateLesson(draggedLesson.value, {
      day: dayIndex,
      classId,
      lessonNumber: lessonIndex,
    });

    nextTick(() => {
      generateLessons();
    });

    draggedLesson.value = null;
  }
};

const hasErrors = (lessonId) => {
  return duplicateLessons.value.some(group => group.some(lesson => lesson.id === lessonId));
};

onMounted(() => {
  generateLessons();
});

const generateLessons = () => {
  lessonStore.generateLessons();
  lessons.value = lessonStore.lessons;
  generateSchedule();
};

const deleteLessons = () => {
  lessonStore.deleteLessons();
  lessons.value = lessonStore.lessons;
  generateSchedule();
};

const getSubjectName = (subjectId) => {
  const subject = subjects.value.find((subject) => subject.id === subjectId);
  return subject ? subject.name : '';
};

const getTeacherColor = (teacherId) => {
  const teacher = teachers.value.find((teacher) => teacher.id === teacherId);
  return teacher ? teacher.color : '';
};
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Уроки</h1>
    <div>
      <div v-if="duplicateLessons.length" class="bg-red-500 rounded text-white text-lg py-2 px-4">
        <span>Знайдено дублікати уроків</span>
      </div>
      <div v-else class="bg-green-500 rounded text-white text-lg py-2 px-4">
        <span>Дублікатів уроків немає</span>
      </div>
    </div>
    <div class="flex items-center justify-between gap-3">
      <Button
          @click="deleteLessons"
          icon="pi pi-trash"
          severity="secondary"
          label="Видалити уроки"
          iconPos="right"
          size="small"
      />
      <Button
          @click="generateLessons"
          icon="pi pi-refresh"
          label="Згенерувати уроки"
          iconPos="right"
          size="small"
      />
    </div>
  </div>

  <div class="my-8 overflow-x-auto" v-if="classes.length">
    <div class="flex items-center sticky top-0">
      <div class="w-12 border h-12 flex-shrink-0 sticky left-0 bg-white"></div>
      <div
          v-for="classItem in classes"
          :key="classItem.id"
          class="w-48 border h-12 flex flex-shrink-0 items-center justify-center"
      >
        {{ classItem.name }}
      </div>
    </div>
    <div
        class="flex items-center"
        v-for="(day, indexDay) in dayNames"
        :key="day"
    >
      <div
          class="w-12 flex-shrink-0 sticky left-0 bg-white border h-48 rotate-180 [writing-mode:vertical-rl] flex items-center justify-center"
      >
        {{ day }}
      </div>
      <div
          v-for="classItem in classes"
          :key="classItem.id"
          class="w-48 flex-shrink-0 border h-48 p-0.5 flex flex-col"
      >
        <div
            v-for="(lessonNumber, lessonIndex) in lessonNumbers"
            :key="lessonIndex"
            class="m-0.5"
            @dragover="handleDragOver($event, classItem.id)"
            @drop="handleDrop(indexDay, classItem.id, lessonIndex)"
        >
          <div
              v-if="schedule[indexDay] && schedule[indexDay][classItem.id] && schedule[indexDay][classItem.id][lessonIndex]"
              draggable="true"
              @dragstart="handleDragStart(schedule[indexDay][classItem.id][lessonIndex])"
              class="border rounded text-xss p-1 text-black flex items-center cursor-grab justify-between"
              :style="{ backgroundColor: getTeacherColor(schedule[indexDay][classItem.id][lessonIndex].teacherId) }"
              :class="{ 'border-red-500 !text-white !bg-red-500': hasErrors(schedule[indexDay][classItem.id][lessonIndex].id) }"
          >
            <span>{{ getSubjectName(schedule[indexDay][classItem.id][lessonIndex].subjectId) }}</span>
          </div>
          <div
              v-else
              class="border rounded text-xss p-1 bg-gray-50 text-gray-400 flex items-center justify-between"
          >
            <span>Вільно</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div
        class="flex items-center flex-col bg-gray-100 my-8 rounded p-8"
    >
      <p class="mb-4">Додайте класи</p>
      <Button
          @click="$router.push('/classes')"
          icon="pi pi-plus"
          label="Додати клас"
          iconPos="right"
          size="small"
      />
    </div>
  </div>
</template>

<style scoped>
[data-dragging="true"] {
  border-color: #4caf50;
  background-color: #e8f5e9;
}
</style>
